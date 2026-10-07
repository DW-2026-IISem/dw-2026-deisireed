import { CreationAttributes, Op, Transaction } from "sequelize";
import { Order, OrderI } from "./order.model";
import { OrderItem } from "../order-items/order-item.model";

/**
 * Capa Repository del feature Orders (tabla `orders`).
 * Única responsable de hablar con Sequelize (el modelo `Order`).
 * "Visible" = estado distinto de `cancelado` (borrado lógico del pedido).
 */
export class OrdersRepository {
  /** Pedidos no cancelados con sus líneas. */
  public async findAllVisibleWithItems(): Promise<Order[]> {
    return Order.findAll({
      where: { estado: { [Op.ne]: "cancelado" } },
      include: [{ model: OrderItem, as: "items" }],
    });
  }

  /** Un pedido con sus líneas (o `null`), sin filtrar por estado. */
  public async findWithItemsById(id: number, transaction?: Transaction): Promise<Order | null> {
    return Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
      transaction,
    });
  }

  /** Un pedido por PK sin líneas (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Order | null> {
    return Order.findByPk(id, { transaction });
  }

  /** Un pedido por PK bloqueando la fila (`SELECT ... FOR UPDATE`). */
  public async findByIdForUpdate(id: number, transaction: Transaction): Promise<Order | null> {
    return Order.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
  }

  /** Inserta la cabecera de un pedido. */
  public async create(data: CreationAttributes<Order>, transaction?: Transaction): Promise<Order> {
    return Order.create(data, { transaction });
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(order: Order, data: Partial<OrderI>, transaction?: Transaction): Promise<Order> {
    return order.update(data, { transaction });
  }

  /** Elimina físicamente una instancia. */
  public async delete(order: Order, transaction?: Transaction): Promise<void> {
    await order.destroy({ transaction });
  }
}
