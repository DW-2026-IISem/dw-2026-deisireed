import { Transaction } from "sequelize";
import {
  CreateOrderItemDto,
  OrderItemResponseDto,
  PatchOrderItemDto,
  UpdateOrderItemDto,
  toOrderItemResponse,
} from "./dto";
import { OrderItem } from "./order-item.model";
import { OrderItemsRepository } from "./order-items.repository";
import { Order } from "../orders/order.model";
import { OrdersRepository } from "../orders/orders.repository";
import { ProductsRepository } from "../products/products.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/**
 * Capa Service del feature OrderItems (tabla `order_items`).
 *
 * Reglas: la línea solo puede crearse/editarse/borrarse mientras el pedido esté
 * `pendiente`; el producto debe existir y estar activo; `valor_unitario` es un
 * snapshot del precio del producto; y cada cambio recalcula el pedido.
 *
 * Orden canónico de locks (evita deadlocks): `orders` -> `order_items`.
 * Entrada y salida con DTOs: nunca se devuelve una instancia de Sequelize.
 */
export class OrderItemsService {
  public constructor(
    private readonly repository: OrderItemsRepository = new OrderItemsRepository(),
    private readonly ordersRepository: OrdersRepository = new OrdersRepository(),
    private readonly productsRepository: ProductsRepository = new ProductsRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<OrderItemResponseDto[]> {
    const items = await this.repository.findAllActive();
    return items.map((item) => toOrderItemResponse(item));
  }

  public async getOne(id: number): Promise<OrderItemResponseDto> {
    return toOrderItemResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  /** Agrega una línea a un pedido existente y recalcula sus totales. */
  public async create(body: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    if (!body.pedido_id || !body.producto_id || !Number.isInteger(body.cantidad) || body.cantidad < 1) {
      throw new AppError(400, "pedido_id, producto_id and cantidad (integer >= 1) are required");
    }

    return withTransaction(async (t) => {
      // 1) Se bloquea primero el pedido (orden canónico).
      const order = await this.ordersRepository.findByIdForUpdate(body.pedido_id, t);
      if (!order) {
        throw new AppError(404, "Order not found");
      }
      this.assertOrderIsPending(order);

      const producto = await this.productsRepository.findById(body.producto_id, t);
      if (!producto) {
        throw new AppError(404, "Product not found");
      }
      if (!producto.is_active) { // ◄ si tu campo se llama distinto
        throw new AppError(400, "Product must be active");
      }

      const valor_unitario = Number(producto.precio); // ◄ si tu campo se llama distinto
      const total = valor_unitario * body.cantidad;

      // Copia campo a campo a propósito (evita *mass assignment*).
      const item = await this.repository.create(
        {
          pedido_id: body.pedido_id,
          producto_id: body.producto_id,
          cantidad: body.cantidad,
          valor_unitario,
          total,
          observaciones: body.observaciones ?? null,
          is_active: body.is_active ?? true,
        },
        t
      );

      await this.recalcOrderTotals(body.pedido_id, t);
      return toOrderItemResponse(item);
    });
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza cantidad y observaciones. */
  public async updatePut(id: number, body: UpdateOrderItemDto): Promise<OrderItemResponseDto> {
    const cantidad = Number(body.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw new AppError(400, "cantidad (integer >= 1) is required");
    }

    return withTransaction(async (t) => {
      const item = await this.lockItem(id, t);
      await this.repository.update(
        item,
        {
          cantidad,
          total: Number(item.valor_unitario) * cantidad,
          observaciones: body.observaciones ?? null,
        },
        t
      );
      await this.recalcOrderTotals(item.pedido_id, t);
      return toOrderItemResponse(item);
    });
  }

  /** PATCH: cambia sólo lo que llega. */
  public async updatePatch(id: number, body: PatchOrderItemDto): Promise<OrderItemResponseDto> {
    if (body.cantidad !== undefined) {
      const cantidad = Number(body.cantidad);
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        throw new AppError(400, "cantidad must be an integer >= 1");
      }
    }

    return withTransaction(async (t) => {
      const item = await this.lockItem(id, t);

      const cantidad = body.cantidad !== undefined ? Number(body.cantidad) : item.cantidad;
      await this.repository.update(
        item,
        {
          cantidad,
          total: Number(item.valor_unitario) * cantidad,
          observaciones: body.observaciones !== undefined ? body.observaciones : item.observaciones,
        },
        t
      );
      await this.recalcOrderTotals(item.pedido_id, t);
      return toOrderItemResponse(item);
    });
  }

  // ================== DELETE ==================
  /** Eliminación física: borra la línea y recalcula el pedido. */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      // `onlyActive: false` -> también permite purgar líneas ya desactivadas.
      const item = await this.lockItem(id, t, false);
      const pedido_id = item.pedido_id;
      await this.repository.delete(item, t);
      await this.recalcOrderTotals(pedido_id, t);
    });
  }

  /** Eliminación lógica -> `is_active = false` y recalcula el pedido. */
  public async deleteLogical(id: number): Promise<OrderItemResponseDto> {
    return withTransaction(async (t) => {
      const item = await this.lockItem(id, t);
      await this.repository.update(item, { is_active: false }, t);
      await this.recalcOrderTotals(item.pedido_id, t);
      return toOrderItemResponse(item);
    });
  }

  // ================== HELPERS DE NEGOCIO ==================
  /** Busca la línea y falla con 404 si no existe (o está desactivada). */
  private async findOrFail(id: number, onlyActive = true): Promise<OrderItem> {
    const item = await this.repository.findById(id);
    if (!item || (onlyActive && !item.is_active)) {
      throw new AppError(404, "Order item not found");
    }
    return item;
  }

  /**
   * Bloquea pedido y línea en el orden canónico `orders` -> `order_items`,
   * y exige que el pedido siga `pendiente`.
   * `pedido_id` es inmutable (el DTO de update no lo expone), por eso se lee
   * sin lock para descubrir qué pedido bloquear primero.
   */
  private async lockItem(id: number, t: Transaction, onlyActive = true): Promise<OrderItem> {
    const snapshot = await this.repository.findById(id, t);
    if (!snapshot) {
      throw new AppError(404, "Order item not found");
    }

    const order = await this.ordersRepository.findByIdForUpdate(snapshot.pedido_id, t);
    if (!order) {
      throw new AppError(404, "Order not found");
    }
    this.assertOrderIsPending(order);

    const item = await this.repository.findByIdForUpdate(id, t);
    if (!item || (onlyActive && !item.is_active)) {
      throw new AppError(404, "Order item not found");
    }
    return item;
  }

  private assertOrderIsPending(order: Order): void {
    if (order.estado !== "pendiente") {
      throw new AppError(400, `Order must be 'pendiente' to change its items (current: ${order.estado})`);
    }
  }

  /** Recalcula `subtotal` y `total` del pedido a partir de sus líneas activas. */
  private async recalcOrderTotals(pedido_id: number, t: Transaction): Promise<void> {
    const items = await this.repository.findActiveByOrderId(pedido_id, t);
    const subtotal = items.reduce((sum, row) => sum + Number(row.total), 0);

    const order = await this.ordersRepository.findById(pedido_id, t);
    if (!order) {
      return;
    }
    await this.ordersRepository.update(order, { subtotal, total: subtotal }, t);
  }
}
