import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/clients/client.model";
import "../../features/business/products/product.model";
import "../../features/business/employees/employee.model";
import "../../features/business/supplies/supply.model";
import "../../features/business/cash-registers/cash-register.model";
import "../../features/business/cash-registers/cash-registers.associations";
import { seedClients } from "../../features/business/clients/clients.seeder";
import { seedProducts } from "../../features/business/products/products.seeder";
import { seedEmployees } from "../../features/business/employees/employees.seeder";
import { seedSupplies } from "../../features/business/supplies/supplies.seeder";
import { seedCashRegisters } from "../../features/business/cash-registers/cash-registers.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta los seeders de TODAS las tablas (features).
 * Orden: padres -> hijos.
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --clients=20 --products=30 --employees=8
 *   SEED_CLIENTS=5 SEED_PRODUCTS=8 SEED_EMPLOYEES=3 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  const isMysql =
    sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: false, alter: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  // Orden: padres -> hijos
  await seedClients(counts.clients);
  await seedProducts(counts.products);
  await seedEmployees(counts.employees);
  await seedSupplies(counts.supplies);
  await seedCashRegisters(counts.cash_registers);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
