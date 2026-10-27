import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import { ROLE_MATRIX } from "./role-matrix";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Seeder de la matriz de permisos (`resource_roles`).
 *
 * Traduce `ROLE_MATRIX` (operaciones `"METHOD /ruta"`) a los `resource_id` reales
 * y deja cada rol **exactamente** con esas concesiones (`reconcileRole`): da de
 * alta las que faltan, reactiva las inactivas y retira las que sobran.
 *
 * Si la matriz nombra una operación que no está en el catálogo (una errata),
 * falla con la lista: así un permiso nunca se pierde en silencio.
 */
export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();

  const resources = await Resource.findAll({ where: { status: "active" } });
  const idByOperation = new Map(resources.map((r) => [`${r.method} ${r.path}`, r.id]));

  let total = 0;
  for (const [roleName, operations] of Object.entries(ROLE_MATRIX)) {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      console.log(`⏭️  resource_roles: no existe el rol ${roleName}, se omite`);
      continue;
    }

    const missing = operations.filter((op) => !idByOperation.has(op));
    if (missing.length > 0) {
      throw new Error(`role-matrix (${roleName}): operaciones fuera del catálogo: ${missing.join(", ")}`);
    }

    const ids = [...new Set(operations.map((op) => idByOperation.get(op) as number))];
    const result = await service.reconcileRole(role.id, ids);
    console.log(
      `✅ resource_roles: ${roleName.padEnd(10)} -> ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  }
  return total;
}
