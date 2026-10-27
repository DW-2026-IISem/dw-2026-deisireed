import {
  CreateSupplyOrderItemDto,
  PatchSupplyOrderItemDto,
  SupplyOrderItemResponseDto,
  UpdateSupplyOrderItemDto,
  toSupplyOrderItemResponse,
} from "./dto";
import { SupplyOrderItemsRepository } from "./supply-order-items.repository";
import { SupplyOrderItem } from "./supply-order-item.model";
import { OrderItemsRepository } from "../order-items/order-items.repository";
import { SuppliesRepository } from "../supplies/supplies.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature SupplyOrderItems (InsumoPedidoDetalle).
 *
 * Reglas de negocio:
 *  - `pedido_detalle_id` debe ser una línea de pedido existente (404) y activa (400).
 *  - `insumo_id` debe ser un insumo existente (404) y activo (400).
 *  - `cantidad_usada` > 0.
 *  - Un insumo se registra una sola vez por línea de pedido (409).
 */
export class SupplyOrderItemsService {
  public constructor(
    private readonly repository: SupplyOrderItemsRepository = new SupplyOrderItemsRepository(),
    private readonly orderItemsRepository: OrderItemsRepository = new OrderItemsRepository(),
    private readonly suppliesRepository: SuppliesRepository = new SuppliesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<SupplyOrderItemResponseDto[]> {
    const items = await this.repository.findAllActive();
    return items.map((item) => toSupplyOrderItemResponse(item));
  }

  public async getOne(id: number): Promise<SupplyOrderItemResponseDto> {
    return toSupplyOrderItemResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateSupplyOrderItemDto): Promise<SupplyOrderItemResponseDto> {
    if (
      body.pedido_detalle_id === undefined ||
      body.insumo_id === undefined ||
      body.cantidad_usada === undefined
    ) {
      throw new AppError(400, "pedido_detalle_id, insumo_id and cantidad_usada are required");
    }
    await this.validate(body.pedido_detalle_id, body.insumo_id, body.cantidad_usada);

    // Copia campo a campo a propósito (evita *mass assignment*).
    const item = await this.repository.create({
      pedido_detalle_id: body.pedido_detalle_id,
      insumo_id: body.insumo_id,
      cantidad_usada: body.cantidad_usada,
      is_active: body.is_active ?? true,
    });
    return toSupplyOrderItemResponse(item);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateSupplyOrderItemDto): Promise<SupplyOrderItemResponseDto> {
    const item = await this.findOrFail(id);
    await this.validate(body.pedido_detalle_id, body.insumo_id, body.cantidad_usada, id);

    await this.repository.update(item, {
      pedido_detalle_id: body.pedido_detalle_id,
      insumo_id: body.insumo_id,
      cantidad_usada: body.cantidad_usada,
    });
    return toSupplyOrderItemResponse(item);
  }

  public async updatePatch(id: number, body: PatchSupplyOrderItemDto): Promise<SupplyOrderItemResponseDto> {
    const item = await this.findOrFail(id);
    await this.validate(
      body.pedido_detalle_id ?? item.pedido_detalle_id,
      body.insumo_id ?? item.insumo_id,
      body.cantidad_usada ?? Number(item.cantidad_usada),
      id
    );

    // Solo campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(item, {
      ...(body.pedido_detalle_id !== undefined && { pedido_detalle_id: body.pedido_detalle_id }),
      ...(body.insumo_id !== undefined && { insumo_id: body.insumo_id }),
      ...(body.cantidad_usada !== undefined && { cantidad_usada: body.cantidad_usada }),
    });
    return toSupplyOrderItemResponse(item);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const item = await this.findOrFail(id, false);
    await this.repository.delete(item);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<SupplyOrderItemResponseDto> {
    const item = await this.findOrFail(id);

    await this.repository.update(item, { is_active: false });
    return toSupplyOrderItemResponse(item);
  }

  // ================== HELPERS ==================
  /** Busca por PK y falla con 404. `onlyActive` aplica la política de borrado lógico. */
  private async findOrFail(id: number, onlyActive = true): Promise<SupplyOrderItem> {
    const item = await this.repository.findById(id);
    if (!item || (onlyActive && !item.is_active)) {
      throw new AppError(404, "Supply order item not found");
    }
    return item;
  }

  /** Valida cantidad, línea de pedido, insumo y que el par no esté repetido. */
  private async validate(
    pedido_detalle_id: number,
    insumo_id: number,
    cantidad_usada: number,
    excludeId?: number
  ): Promise<void> {
    if (typeof cantidad_usada !== "number" || !Number.isFinite(cantidad_usada) || cantidad_usada <= 0) {
      throw new AppError(400, "cantidad_usada must be a number greater than 0");
    }

    const orderItem = await this.orderItemsRepository.findById(pedido_detalle_id);
    if (!orderItem) {
      throw new AppError(404, "Order item (pedido_detalle_id) not found");
    }
    if (!orderItem.is_active) {
      throw new AppError(400, "Order item must be active");
    }

    const supply = await this.suppliesRepository.findById(insumo_id);
    if (!supply) {
      throw new AppError(404, "Supply (insumo_id) not found");
    }
    if (!supply.is_active) {
      throw new AppError(400, "Supply must be active");
    }

    const duplicate = await this.repository.findByPair(pedido_detalle_id, insumo_id, excludeId);
    if (duplicate) {
      throw new AppError(409, "This supply is already registered for this order item");
    }
  }
}
