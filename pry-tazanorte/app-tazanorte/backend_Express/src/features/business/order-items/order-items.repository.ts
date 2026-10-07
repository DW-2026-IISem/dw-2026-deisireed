import { CreationAttributes, Transaction } from "sequelize";
import { OrderItem, OrderItemI } from "./order-item.model";

/**
 * Capa Repository del feature OrderItems (tabla `order_items`).
 * Única responsable de hablar con Sequelize (el modelo `OrderItem`).
 */
export class OrderItemsRepository {
  /** Todas las líneas activas. */
  public async findAllActive(): Promise<OrderItem[]> {
    return OrderItem.findAll({ where: { is_active: true } });
  }

  /** Una línea por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<OrderItem | null> {
    return OrderItem.findByPk(id, { transaction });
  }

  /** Una línea por PK bloqueando la fila (`SELECT ... FOR UPDATE`). */
  public async findByIdForUpdate(id: number, transaction: Transaction): Promise<OrderItem | null> {
    return OrderItem.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
  }

  /** Líneas activas de un pedido (para recalcular subtotal/total). */
  public async findActiveByOrderId(pedido_id: number, transaction?: Transaction): Promise<OrderItem[]> {
    return OrderItem.findAll({ where: { pedido_id, is_active: true }, transaction });
  }

  /** Inserta una línea. */
  public async create(data: CreationAttributes<OrderItem>, transaction?: Transaction): Promise<OrderItem> {
    return OrderItem.create(data, { transaction });
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(item: OrderItem, data: Partial<OrderItemI>, transaction?: Transaction): Promise<OrderItem> {
    return item.update(data, { transaction });
  }

  /** Elimina físicamente una instancia. */
  public async delete(item: OrderItem, transaction?: Transaction): Promise<void> {
    await item.destroy({ transaction });
  }

  /** Elimina físicamente todas las líneas de un pedido. */
  public async deleteByOrderId(pedido_id: number, transaction?: Transaction): Promise<number> {
    return OrderItem.destroy({ where: { pedido_id }, transaction });
  }

  /** Desactiva (borrado lógico) todas las líneas de un pedido. */
  public async deactivateByOrderId(pedido_id: number, transaction?: Transaction): Promise<number> {
    const [affected] = await OrderItem.update({ is_active: false }, { where: { pedido_id }, transaction });
    return affected;
  }
}
