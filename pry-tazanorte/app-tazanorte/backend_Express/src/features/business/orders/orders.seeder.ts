import { faker } from "@faker-js/faker";
import { Order } from "./order.model";
import { Client } from "../clients/client.model";
import { CashRegister } from "../cash-registers/cash-register.model";

/**
 * Seeder del feature Order (tabla `orders`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere clientes y turnos de caja activos. Idempotente: si ya hay filas, omite.
 * Crea cabeceras `pendiente` con totales en 0; el seeder de `order_items`
 * agrega las líneas y recalcula subtotal/total.
 */
export async function seedOrders(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  orders: count=0, se omite");
    return 0;
  }

  const existing = await Order.count();
  if (existing > 0) {
    console.log(`⏭️  orders: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const clients = await Client.findAll({ where: { is_active: true } }); // ◄ si tu campo se llama distinto
  const registers = await CashRegister.findAll({ where: { is_active: true } }); // ◄ si tu campo se llama distinto

  if (clients.length === 0 || registers.length === 0) {
    console.log("⏭️  orders: faltan clientes o turnos de caja activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const register = registers[Math.floor(Math.random() * registers.length)];
    return {
      cliente_id: client.id,
      turno_caja_id: register.id,
      canal: faker.helpers.arrayElement(["caja", "para_llevar"] as const),
      fecha: faker.date.recent({ days: 7 }),
      subtotal: 0,
      total: 0,
      estado: "pendiente" as const,
    };
  });

  await Order.bulkCreate(rows);
  console.log(`✅ orders: insertados ${count} registro(s) falsos`);
  return count;
}
