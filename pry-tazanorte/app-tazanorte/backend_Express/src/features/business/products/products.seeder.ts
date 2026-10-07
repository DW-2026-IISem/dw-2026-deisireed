import { faker } from "@faker-js/faker";
import { Product } from "./product.model";

const MENU = [
  "Espresso",
  "Americano",
  "Capuchino",
  "Latte",
  "Moca",
  "Té chai",
  "Chocolate caliente",
  "Croissant",
  "Sándwich de pollo",
  "Brownie",
];

/**
 * Seeder del feature Product (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedProducts(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  products: count=0, se omite");
    return 0;
  }

  const existing = await Product.count();
  if (existing > 0) {
    console.log(`⏭️  products: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    // El índice garantiza que el sku (UNIQUE) no se repita.
    sku: `PRD-${String(i + 1).padStart(4, "0")}`,
    nombre: faker.helpers.arrayElement(MENU),
    descripcion: faker.lorem.sentence(),
    precio: faker.number.int({ min: 2000, max: 15000, multipleOf: 500 }),
    is_active: true,
  }));

  await Product.bulkCreate(rows, { validate: true });
  console.log(`✅ products: insertados ${count} registro(s) falsos`);
  return count;
}
