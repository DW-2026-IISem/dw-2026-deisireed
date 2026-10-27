import { CreationAttributes, Op, Transaction } from "sequelize";
import { SupplyOrderItem, SupplyOrderItemI } from "./supply-order-item.model";

/**
 * Capa Repository del feature SupplyOrderItems.
 * Única responsable de hablar con Sequelize (el modelo `SupplyOrderItem`).
 */
export class SupplyOrderItemsRepository {
  // ================== READ ==================
  /** Todos los consumos activos. */
  public async findAllActive(): Promise<SupplyOrderItem[]> {
    return SupplyOrderItem.findAll({ where: { is_active: true } });
  }

  /** Un consumo por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<SupplyOrderItem | null> {
    return SupplyOrderItem.findByPk(id, { transaction });
  }

  /** Busca el par (línea de pedido, insumo), opcionalmente excluyendo un id. */
  public async findByPair(
    pedido_detalle_id: number,
    insumo_id: number,
    excludeId?: number
  ): Promise<SupplyOrderItem | null> {
    return SupplyOrderItem.findOne({
      where: {
        pedido_detalle_id,
        insumo_id,
        ...(excludeId !== undefined ? { id: { [Op.ne]: excludeId } } : {}),
      },
    });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<SupplyOrderItem>): Promise<SupplyOrderItem> {
    return SupplyOrderItem.create(data);
  }

  // ================== UPDATE ==================
  public async update(item: SupplyOrderItem, data: Partial<SupplyOrderItemI>): Promise<SupplyOrderItem> {
    return item.update(data);
  }

  // ================== DELETE ==================
  public async delete(item: SupplyOrderItem): Promise<void> {
    await item.destroy();
  }
}
