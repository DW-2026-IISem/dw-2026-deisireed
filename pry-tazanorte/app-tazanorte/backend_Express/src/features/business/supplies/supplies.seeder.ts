import { faker } from "@faker-js/faker";
import { Supply } from "./supply.model";

const INSUMOS = [
  { nombre: "Café en grano", unidad: "kg" },
  { nombre: "Leche entera", unidad: "l" },
  { nombre: "Azúcar", unidad: "kg" },
  { nombre: "Chocolate en polvo", unidad: "kg" },
  { nombre: "Harina de trigo", unidad: "kg" },
  { nombre: "Mantequilla", unidad: "kg" },
  { nombre: "Vasos de 8 oz", unidad: "unidad" },
  { nombre: "Té chai", unidad: "g" },
];

/**
 * Seeder del feature Supply (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedSupplies(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  supplies: count=0, se omite");
    return 0;
  }

  const existing = await Supply.count();
  if (existing > 0) {
    console.log(`⏭️  supplies: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => {
    const item = INSUMOS[i % INSUMOS.length];
    return {
      // El índice garantiza que el codigo (UNIQUE) no se repita.
      codigo: `INS-${String(i + 1).padStart(4, "0")}`,
      nombre: item.nombre,
      unidad_medida: item.unidad,
      stock_minimo: faker.number.int({ min: 1, max: 20 }),
      is_active: true,
    };
  });

  await Supply.bulkCreate(rows, { validate: true });
  console.log(`✅ supplies: insertados ${count} registro(s) falsos`);
  return count;
}
