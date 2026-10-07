import { faker } from "@faker-js/faker";
import { Employee } from "./employee.model";

const CARGOS = ["Barista", "Cajero", "Bodeguero", "Supervisor"];

/**
 * Seeder del feature Employee (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedEmployees(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  employees: count=0, se omite");
    return 0;
  }

  const existing = await Employee.count();
  if (existing > 0) {
    console.log(`⏭️  employees: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    nombre: faker.person.fullName(),
    descripcion: faker.helpers.arrayElement(CARGOS),
    is_active: true,
  }));

  await Employee.bulkCreate(rows, { validate: true });
  console.log(`✅ employees: insertados ${count} registro(s) falsos`);
  return count;
}
