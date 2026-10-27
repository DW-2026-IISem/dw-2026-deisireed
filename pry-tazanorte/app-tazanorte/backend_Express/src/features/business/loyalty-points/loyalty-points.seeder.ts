import { Op } from "sequelize";
import { LoyaltyPoint, ORDER_STATES_THAT_EARN, PESOS_PER_POINT } from "./loyalty-point.model";
import { Order } from "../orders/order.model";

/**
 * Seeder del feature LoyaltyPoint (tabla `loyalty_points`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Respeta la regla de negocio: solo crea **acumulaciones** para pedidos ya
 * pagados (`pagado`, `en_preparacion`, `entregado`), una por pedido, con
 * 1 punto por cada $1.000 del total. Si todavía no hay pedidos pagados, omite.
 * Idempotente: si ya hay filas, omite.
 */
export async function seedLoyaltyPoints(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  loyalty_points: count=0, se omite");
    return 0;
  }

  const existing = await LoyaltyPoint.count();
  if (existing > 0) {
    console.log(`⏭️  loyalty_points: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const paidOrders = await Order.findAll({
    where: { estado: { [Op.in]: [...ORDER_STATES_THAT_EARN] } },
    limit: count,
  });

  const rows = paidOrders
    .map((order) => ({
      cliente_id: order.cliente_id,
      pedido_id: order.id,
      tipo: "acumulacion" as const,
      cantidad: Math.floor(Number(order.total) / PESOS_PER_POINT),
      fecha: order.fecha,
      observaciones: `Compra pedido #${order.id}`,
      is_active: true,
    }))
    .filter((row) => row.cantidad >= 1);

  if (rows.length === 0) {
    console.log("⏭️  loyalty_points: aún no hay pedidos pagados, se omite seeder");
    return 0;
  }

  await LoyaltyPoint.bulkCreate(rows, { validate: true });
  console.log(`✅ loyalty_points: insertados ${rows.length} movimiento(s) de acumulación`);
  return rows.length;
}
