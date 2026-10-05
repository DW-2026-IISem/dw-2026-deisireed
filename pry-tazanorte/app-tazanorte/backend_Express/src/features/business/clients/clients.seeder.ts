import { faker } from "@faker-js/faker";
import { Client } from "./client.model";

/**
 * Seeder del feature Client (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedClients(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  clients: count=0, se omite");
    return 0;
  }

  const existing = await Client.count();
  if (existing > 0) {
    console.log(`⏭️  clients: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    tipo_documento: faker.helpers.arrayElement(["CC", "CE", "TI", "PP"]),
    // El índice al final garantiza que numero_documento (UNIQUE) no se repita.
    numero_documento: `${faker.string.numeric(6)}${String(i).padStart(4, "0")}`,
    nombre: faker.person.fullName(),
    telefono: faker.phone.number({ style: "national" }),
    email: `cliente.${i}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase(),
    is_active: true,
  }));

  await Client.bulkCreate(rows, { validate: true });
  console.log(`✅ clients: insertados ${count} registro(s) falsos`);
  return count;
}
