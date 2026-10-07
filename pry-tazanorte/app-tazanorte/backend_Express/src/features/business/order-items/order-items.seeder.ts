import { faker } from "@faker-js/faker";
import { sequelize } from "../../../database/db";
import { OrderItem } from "./order-item.model";
import { Order } from "../orders/order.model";
import { Product } from "../products/product.model";

/**
 * Seeder del feature OrderItem (tabla `order_items`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere pedidos 'pendiente' y productos activos. Idempotente: si ya hay filas, omite.
 * Recalcula subtotal/total de cada pedido afectado.
 */
export async function seedOrderItems(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  order_items: count=0, se omite");
    return 0;
  }

  const existing = await OrderItem.count();
  if (existing > 0) {
    console.log(`⏭️  order_items: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const orders = await Order.findAll({ where: { estado: "pendiente" } });
  const products = await Product.findAll({ where: { is_active: true } }); // ◄ si tu campo se llama distinto

  if (orders.length === 0 || products.length === 0) {
    console.log("⏭️  order_items: faltan pedidos pendientes o productos activos, se omite seeder");
    return 0;
  }

  let created = 0;

  for (let i = 0; i < count; i += 1) {
    const order = orders[i % orders.length];
    const product = products[Math.floor(Math.random() * products.length)];

    const t = await sequelize.transaction();
    try {
      const cantidad = faker.number.int({ min: 1, max: 3 });
      const valor_unitario = Number(product.precio); // ◄ si tu campo se llama distinto

      await OrderItem.create(
        {
          pedido_id: order.id,
          producto_id: product.id,
          cantidad,
          valor_unitario,
          total: valor_unitario * cantidad,
          observaciones: faker.helpers.maybe(() => faker.lorem.words(3), { probability: 0.3 }) ?? null,
          is_active: true,
        },
        { transaction: t }
      );

      // El seeder no pasa por el service: replica la regla de recálculo del pedido.
      const items = await OrderItem.findAll({
        where: { pedido_id: order.id, is_active: true },
        transaction: t,
      });
      const subtotal = items.reduce((sum, row) => sum + Number(row.total), 0);
      await order.update({ subtotal, total: subtotal }, { transaction: t });

      await t.commit();
      created += 1;
    } catch {
      await t.rollback();
    }
  }

  console.log(`✅ order_items: insertados ${created} registro(s) falsos`);
  return created;
}
