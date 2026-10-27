import { faker } from "@faker-js/faker";
import { SupplyOrderItem } from "./supply-order-item.model";
import { OrderItem } from "../order-items/order-item.model";
import { Supply } from "../supplies/supply.model";

/**
 * Seeder del feature SupplyOrderItem (tabla `supply_order_items`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere líneas de pedido e insumos activos. Genera pares (línea, insumo)
 * **sin repetir** (respeta la UK). Idempotente: si ya hay filas, omite.
 */
export async function seedSupplyOrderItems(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  supply_order_items: count=0, se omite");
    return 0;
  }

  const existing = await SupplyOrderItem.count();
  if (existing > 0) {
    console.log(`⏭️  supply_order_items: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const orderItems = await OrderItem.findAll({ where: { is_active: true } });
  const supplies = await Supply.findAll({ where: { is_active: true } });
  if (orderItems.length === 0 || supplies.length === 0) {
    console.log("⏭️  supply_order_items: faltan líneas de pedido o insumos activos, se omite seeder");
    return 0;
  }

  // Todos los pares posibles, barajados; se toman los primeros `count`.
  const pairs = faker.helpers.shuffle(
    orderItems.flatMap((item) => supplies.map((supply) => ({ item, supply })))
  );
  const rows = pairs.slice(0, count).map(({ item, supply }) => ({
    pedido_detalle_id: item.id,
    insumo_id: supply.id,
    cantidad_usada: faker.number.float({ min: 0.05, max: 2, fractionDigits: 2 }),
    is_active: true,
  }));

  await SupplyOrderItem.bulkCreate(rows, { validate: true });
  console.log(`✅ supply_order_items: insertados ${rows.length} registro(s) falsos`);
  return rows.length;
}
