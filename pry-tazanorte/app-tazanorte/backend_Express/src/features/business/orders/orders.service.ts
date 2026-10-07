import { Transaction } from "sequelize";
import {
  CreateOrderDto,
  CreateOrderResultDto,
  OrderResponseDto,
  PatchOrderDto,
  UpdateOrderDto,
  UpdateOrderStateDto,
  toOrderResponse,
} from "./dto";
import { toOrderItemResponse } from "../order-items/dto";
import { Order, OrderChannel, OrderState } from "./order.model";
import { OrdersRepository } from "./orders.repository";
import { OrderItem } from "../order-items/order-item.model";
import { OrderItemsRepository } from "../order-items/order-items.repository";
import { Product } from "../products/product.model";
import { ProductsRepository } from "../products/products.repository";
import { ClientsRepository } from "../clients/clients.repository";
import { CashRegistersRepository } from "../cash-registers/cash-registers.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

const VALID_CHANNELS: OrderChannel[] = ["caja", "para_llevar"];

/** Máquina de estados del pedido: estado actual -> estados permitidos. */
const ALLOWED_TRANSITIONS: Record<OrderState, OrderState[]> = {
  pendiente: ["pagado", "cancelado"],
  pagado: ["en_preparacion", "entregado", "cancelado"],
  en_preparacion: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

/** Línea calculada en memoria antes de persistir el pedido (tipo interno, no DTO). */
type OrderLine = {
  producto_id: number;
  cantidad: number;
  valor_unitario: number;
  total: number;
  observaciones: string | null;
  product: Product;
};

/**
 * Capa Service del feature Orders.
 *
 * Reglas de negocio de un pedido: exige al menos una línea, valida cliente,
 * turno de caja y productos activos, calcula subtotal/total, controla la máquina
 * de estados y garantiza atomicidad con una transacción (unit of work).
 *
 * - Una vez que el pedido deja de estar `pendiente` ya no se edita su cabecera
 *   ni sus líneas (los puntos y pagos se acreditan sobre pedidos pagados).
 * - El borrado lógico es la **cancelación** (`estado = cancelado`).
 * - El borrado físico solo aplica a pedidos `pendiente` o `cancelado`.
 *
 * Orden canónico de locks: `orders` -> `order_items`.
 * Entrada y salida con DTOs: nunca se devuelve una instancia de Sequelize.
 */
export class OrdersService {
  public constructor(
    private readonly repository: OrdersRepository = new OrdersRepository(),
    private readonly itemsRepository: OrderItemsRepository = new OrderItemsRepository(),
    private readonly productsRepository: ProductsRepository = new ProductsRepository(),
    private readonly clientsRepository: ClientsRepository = new ClientsRepository(),
    private readonly cashRegistersRepository: CashRegistersRepository = new CashRegistersRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<OrderResponseDto[]> {
    const orders = await this.repository.findAllVisibleWithItems();
    return orders.map((order) => toOrderResponse(order));
  }

  public async getOne(id: number): Promise<OrderResponseDto> {
    return toOrderResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  /** Crea el pedido completo (cabecera + líneas) en una sola transacción. */
  public async create(body: CreateOrderDto): Promise<CreateOrderResultDto> {
    if (!body.cliente_id || !body.turno_caja_id) {
      throw new AppError(400, "cliente_id and turno_caja_id are required");
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw new AppError(400, "Order requires at least one item");
    }

    const canal: OrderChannel = body.canal ?? "caja";
    this.assertChannel(canal);

    for (const item of body.items) {
      if (!item.producto_id || !Number.isInteger(item.cantidad) || item.cantidad < 1) {
        throw new AppError(400, "Each item requires producto_id and cantidad (integer >= 1)");
      }
    }

    return withTransaction(async (t) => {
      await this.assertActiveClient(body.cliente_id);
      await this.assertActiveCashRegister(body.turno_caja_id);

      const lines: OrderLine[] = [];
      let subtotal = 0;

      // Se procesan los productos de menor a mayor `producto_id` (orden estable).
      const orderedItems = [...body.items].sort(
        (a, b) => Number(a.producto_id) - Number(b.producto_id)
      );

      for (const item of orderedItems) {
        const product = await this.productsRepository.findById(item.producto_id, t);
        if (!product) {
          throw new AppError(404, `Product not found: ${item.producto_id}`);
        }
        if (!product.is_active) { // ◄ si tu campo se llama distinto
          throw new AppError(400, `Product must be active: ${item.producto_id}`);
        }

        const valor_unitario = Number(product.precio); // ◄ si tu campo se llama distinto
        const total = valor_unitario * item.cantidad;
        subtotal += total;
        lines.push({
          producto_id: product.id,
          cantidad: item.cantidad,
          valor_unitario,
          total,
          observaciones: item.observaciones ?? null,
          product,
        });
      }

      // Copia campo a campo a propósito (evita *mass assignment*).
      const order = await this.repository.create(
        {
          cliente_id: body.cliente_id,
          turno_caja_id: body.turno_caja_id,
          canal,
          fecha: body.fecha ?? new Date(),
          subtotal,
          total: subtotal,
          estado: "pendiente",
        },
        t
      );

      const items: OrderItem[] = [];
      for (const line of lines) {
        const item = await this.itemsRepository.create(
          {
            pedido_id: order.id,
            producto_id: line.producto_id,
            cantidad: line.cantidad,
            valor_unitario: line.valor_unitario,
            total: line.total,
            observaciones: line.observaciones,
            is_active: true,
          },
          t
        );
        items.push(item);
      }

      return {
        order: toOrderResponse(order),
        items: items.map((item) => toOrderItemResponse(item)),
      };
    });
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza la cabecera (las líneas se gestionan en `/api/detalle-pedidos`). */
  public async updatePut(id: number, body: UpdateOrderDto): Promise<OrderResponseDto> {
    this.assertChannel(body.canal);

    return withTransaction(async (t) => {
      const order = await this.lockPending(id, t);

      if (body.cliente_id !== undefined) {
        await this.assertActiveClient(body.cliente_id);
      }
      if (body.turno_caja_id !== undefined) {
        await this.assertActiveCashRegister(body.turno_caja_id);
      }

      await this.repository.update(
        order,
        {
          cliente_id: body.cliente_id ?? order.cliente_id,
          turno_caja_id: body.turno_caja_id ?? order.turno_caja_id,
          canal: body.canal,
          fecha: body.fecha ?? order.fecha,
        },
        t
      );

      const updated = await this.repository.findWithItemsById(id, t);
      return toOrderResponse(updated ?? order);
    });
  }

  /** PATCH: cambia sólo lo que llega (lo omitido se conserva). */
  public async updatePatch(id: number, body: PatchOrderDto): Promise<OrderResponseDto> {
    if (body.canal !== undefined) {
      this.assertChannel(body.canal);
    }

    return withTransaction(async (t) => {
      const order = await this.lockPending(id, t);

      if (body.cliente_id !== undefined) {
        await this.assertActiveClient(body.cliente_id);
      }
      if (body.turno_caja_id !== undefined) {
        await this.assertActiveCashRegister(body.turno_caja_id);
      }

      // Sólo se aplican los campos del DTO: `subtotal`, `total` y `estado` nunca llegan del cliente.
      await this.repository.update(
        order,
        {
          cliente_id: body.cliente_id ?? order.cliente_id,
          turno_caja_id: body.turno_caja_id ?? order.turno_caja_id,
          canal: body.canal ?? order.canal,
          fecha: body.fecha ?? order.fecha,
        },
        t
      );

      const updated = await this.repository.findWithItemsById(id, t);
      return toOrderResponse(updated ?? order);
    });
  }

  /** Cambio de estado validado por la máquina de estados. */
  public async updateState(id: number, body: UpdateOrderStateDto): Promise<OrderResponseDto> {
    const estado = body.estado;
    if (!estado || !Object.keys(ALLOWED_TRANSITIONS).includes(estado)) {
      throw new AppError(400, `estado must be one of: ${Object.keys(ALLOWED_TRANSITIONS).join(", ")}`);
    }

    return withTransaction(async (t) => {
      const order = await this.repository.findByIdForUpdate(id, t);
      if (!order || order.estado === "cancelado") {
        throw new AppError(404, "Order not found");
      }

      if (!ALLOWED_TRANSITIONS[order.estado].includes(estado)) {
        throw new AppError(400, `Invalid state transition: ${order.estado} -> ${estado}`);
      }

      if (estado === "pagado") {
        const activeItems = await this.itemsRepository.findActiveByOrderId(id, t);
        if (activeItems.length === 0 || Number(order.total) <= 0) {
          throw new AppError(400, "Order needs at least one active item to be paid");
        }
      }

      if (estado === "cancelado") {
        await this.itemsRepository.deactivateByOrderId(id, t);
      }

      await this.repository.update(order, { estado }, t);

      const updated = await this.repository.findWithItemsById(id, t);
      return toOrderResponse(updated ?? order);
    });
  }

  // ================== DELETE ==================
  /** Eliminación física: sólo pedidos `pendiente` o `cancelado` (borra líneas y cabecera). */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      // Sin filtro de estado: permite purgar también pedidos cancelados.
      const order = await this.repository.findByIdForUpdate(id, t);
      if (!order) {
        throw new AppError(404, "Order not found");
      }
      if (order.estado !== "pendiente" && order.estado !== "cancelado") {
        throw new AppError(
          400,
          `Only 'pendiente' or 'cancelado' orders can be permanently deleted (current: ${order.estado})`
        );
      }

      await this.itemsRepository.deleteByOrderId(id, t);
      await this.repository.delete(order, t);
    });
  }

  /** Eliminación lógica = cancelación: `estado = cancelado` y desactiva las líneas. */
  public async deleteLogical(id: number): Promise<OrderResponseDto> {
    return this.updateState(id, { estado: "cancelado" });
  }

  // ================== HELPERS DE NEGOCIO ==================
  /** Pedido con líneas; 404 si no existe o está cancelado (borrado lógico). */
  private async findOrFail(id: number): Promise<Order> {
    const order = await this.repository.findWithItemsById(id);
    if (!order || order.estado === "cancelado") {
      throw new AppError(404, "Order not found");
    }
    return order;
  }

  /** Bloquea el pedido y exige que siga `pendiente` (única etapa en la que se edita). */
  private async lockPending(id: number, t: Transaction): Promise<Order> {
    const order = await this.repository.findByIdForUpdate(id, t);
    if (!order || order.estado === "cancelado") {
      throw new AppError(404, "Order not found");
    }
    if (order.estado !== "pendiente") {
      throw new AppError(400, `Only 'pendiente' orders can be edited (current: ${order.estado})`);
    }
    return order;
  }

  private assertChannel(canal: string): void {
    if (!VALID_CHANNELS.includes(canal as OrderChannel)) {
      throw new AppError(400, `canal must be one of: ${VALID_CHANNELS.join(", ")}`);
    }
  }

  /** Regla: el cliente del pedido debe existir y estar activo. */
  private async assertActiveClient(cliente_id: number): Promise<void> {
    const client = await this.clientsRepository.findById(cliente_id);
    if (!client) {
      throw new AppError(404, "Client not found");
    }
    if (!client.is_active) { // ◄ si tu campo se llama distinto
      throw new AppError(400, "Client must be active");
    }
  }

  /** Regla: el turno de caja del pedido debe existir y estar activo. */
  private async assertActiveCashRegister(turno_caja_id: number): Promise<void> {
    const cashRegister = await this.cashRegistersRepository.findById(turno_caja_id);
    if (!cashRegister) {
      throw new AppError(404, "Cash register (turno de caja) not found");
    }
    if (!cashRegister.is_active) { // ◄ si tu campo se llama distinto
      throw new AppError(400, "Cash register (turno de caja) must be active");
    }
  }
}
