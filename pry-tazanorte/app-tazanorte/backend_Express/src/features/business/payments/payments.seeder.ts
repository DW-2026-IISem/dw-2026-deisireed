import { faker } from "@faker-js/faker";
import { Op } from "sequelize";
import { Payment, PAYMENT_METHODS } from "./payment.model";
import { Order } from "../orders/order.model";

/**
 * Seeder del feature Payment (tabla `payments`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Registra un pago por cada pedido con total > 0 (hasta `count`):
 * `monto` = total del pedido; `estado` = PENDIENTE si el pedido sigue pendiente,
 * COMPLETADO en otro caso. Idempotente: si ya hay filas, omite.
 */
export async function seedPayments(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  payments: count=0, se omite");
    return 0;
  }

  const existing = await Payment.count();
  if (existing > 0) {
    console.log(`⏭️  payments: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const orders = await Order.findAll({
    where: { total: { [Op.gt]: 0 }, estado: { [Op.ne]: "cancelado" } },
    limit: count,
  });
  if (orders.length === 0) {
    console.log("⏭️  payments: no hay pedidos con total > 0, se omite seeder");
    return 0;
  }

  const rows = orders.map((order) => ({
    referencia_tipo: "PEDIDO" as const,
    referencia_id: order.id,
    metodo: faker.helpers.arrayElement(PAYMENT_METHODS),
    monto: Number(order.total),
    fecha: order.fecha,
    estado: order.estado === "pendiente" ? ("PENDIENTE" as const) : ("COMPLETADO" as const),
    is_active: true,
  }));

  await Payment.bulkCreate(rows, { validate: true });
  console.log(`✅ payments: insertados ${rows.length} registro(s)`);
  return rows.length;
}
