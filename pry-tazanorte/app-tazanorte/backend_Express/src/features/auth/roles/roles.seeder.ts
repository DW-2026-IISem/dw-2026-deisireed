import { Role } from "./role.model";

/**
 * Seeder del catálogo de roles (`roles`).
 *
 * Crea los cinco roles de TazaNorte. Es determinista (sin datos aleatorios) e
 * idempotente: `findOrCreate` por nombre y reactivación si ya existía inactivo.
 *
 * Los roles nacen **sin permisos**: las concesiones las crea el seeder de
 * `resource_roles` (ISS-19) a partir de la matriz de permisos.
 */
export const SEED_ROLES = [
  { name: "ADMIN", description: "Administración del sistema: usuarios, roles, permisos y catálogos" },
  { name: "CAJA", description: "Caja: registra pedidos, pagos y puntos de fidelización" },
  { name: "BARISTA", description: "Barra: consulta y prepara pedidos, registra consumo de insumos" },
  { name: "BODEGA", description: "Bodega: gestiona insumos y su consumo" },
  { name: "SUPERVISOR", description: "Supervisión: consulta la operación, turnos de caja y empleados" },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name, description: item.description, status: "active" },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }

  console.log(`✅ roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos)`);
  return created;
}
