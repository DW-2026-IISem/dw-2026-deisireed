import { seedPayments } from "../../features/business/payments/payments.seeder";

// tazanorte · Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones
import "../../features/auth/users/user.model";
import "../../features/auth/roles/role.model";
import "../../features/auth/resources/resource.model";
import "../../features/auth/role-users/role-user.model";
import "../../features/auth/resource-roles/resource-role.model";
import "../../features/auth/refresh-tokens/refresh-token.model";
import "../../features/auth/rbac.associations";

export const runSeeders = async () => {
  try {
    console.log("Iniciando Seeders...");
    await seedPayments(10);
    console.log("Seeders ejecutados correctamente.");
  } catch (error) {
    console.error("Error al ejecutar seeders:", error);
  }
};
