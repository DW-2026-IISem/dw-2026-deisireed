import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
// Fase I — Business: modelos (padres → hijos) y después las asociaciones
import "../../features/business/clients/client.model";
import "../../features/business/products/product.model";
import "../../features/business/employees/employee.model";
import "../../features/business/supplies/supply.model";
import "../../features/business/cash-registers/cash-register.model";
import "../../features/business/orders/order.model";
import "../../features/business/order-items/order-item.model";
import "../../features/business/supply-order-items/supply-order-item.model";
import "../../features/business/payments/payment.model";
import "../../features/business/loyalty-points/loyalty-point.model";
import "../../features/business/cash-registers/cash-registers.associations";
import "../../features/business/orders/orders.associations";
import "../../features/business/order-items/order-items.associations";
import "../../features/business/supply-order-items/supply-order-items.associations";
import "../../features/business/loyalty-points/loyalty-points.associations";
// Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones
import "../../features/auth/users/user.model";
import "../../features/auth/roles/role.model";
import "../../features/auth/resources/resource.model";
import "../../features/auth/role-users/role-user.model";
import "../../features/auth/resource-roles/resource-role.model";
import "../../features/auth/refresh-tokens/refresh-token.model";
import "../../features/auth/rbac.associations";
import { seedClients } from "../../features/business/clients/clients.seeder";
import { seedProducts } from "../../features/business/products/products.seeder";
import { seedEmployees } from "../../features/business/employees/employees.seeder";
import { seedSupplies } from "../../features/business/supplies/supplies.seeder";
import { seedCashRegisters } from "../../features/business/cash-registers/cash-registers.seeder";
import { seedOrders } from "../../features/business/orders/orders.seeder";
import { seedOrderItems } from "../../features/business/order-items/order-items.seeder";
import { seedSupplyOrderItems } from "../../features/business/supply-order-items/supply-order-items.seeder";
import { seedPayments } from "../../features/business/payments/payments.seeder";
import { seedLoyaltyPoints } from "../../features/business/loyalty-points/loyalty-points.seeder";
import { seedUsers } from "../../features/auth/users/users.seeder";
import { seedRoles } from "../../features/auth/roles/roles.seeder";
import { seedResources } from "../../features/auth/resources/resources.seeder";
import { seedRoleUsers } from "../../features/auth/role-users/role-users.seeder";
import { seedResourceRoles } from "../../features/auth/resource-roles/resource-roles.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta los seeders de TODAS las tablas de TazaNorte.
 *
 * Orden (padres → hijos):
 *   clients → products → employees → supplies → cash_registers
 *   → orders → order_items → payments
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --clients=20 --orders=10
 *   SEED_CLIENTS=5 npm run db:seed
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

  // Orden: business (padres → hijos)
  await seedClients(counts.clients);
  await seedProducts(counts.products);
  await seedEmployees(counts.employees);
  await seedSupplies(counts.supplies);
  await seedCashRegisters(counts.cash_registers);
  await seedOrders(counts.orders);
  await seedOrderItems(counts.order_items);
  await seedSupplyOrderItems(counts.supply_order_items);
  await seedPayments(counts.payments);
  await seedLoyaltyPoints(counts.loyalty_points);

  // Orden: auth (usuarios → roles → recursos → asignaciones → matriz de permisos)
  await seedUsers(counts.users);
  await seedRoles();
  await seedResources();
  await seedRoleUsers();
  await seedResourceRoles();

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
