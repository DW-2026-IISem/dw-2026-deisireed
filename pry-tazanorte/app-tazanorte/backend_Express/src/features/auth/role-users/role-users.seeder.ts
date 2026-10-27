import { RoleUser } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/**
 * Seeder de asignaciones usuario ↔ rol (`role_users`).
 *
 * Un usuario canónico por rol. Los usuarios `invitado.*` quedan **sin rol**:
 * sirven para comprobar que estar autenticado no basta (403).
 * Idempotente: `findOrCreate` por `(user_id, role_id)` y reactivación.
 */
export const SEED_ROLE_USERS = [
  { username: "admin", roleName: "ADMIN" },
  { username: "caja", roleName: "CAJA" },
  { username: "barista", roleName: "BARISTA" },
  { username: "bodega", roleName: "BODEGA" },
  { username: "supervisor", roleName: "SUPERVISOR" },
] as const;

export async function seedRoleUsers(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLE_USERS) {
    const user = await User.findOne({ where: { username: item.username } });
    const role = await Role.findOne({ where: { name: item.roleName } });
    if (!user || !role) {
      console.log(`⏭️  role_users: falta ${item.username} o ${item.roleName}, se omite esa asignación`);
      continue;
    }

    const [assignment, wasCreated] = await RoleUser.findOrCreate({
      where: { user_id: user.id, role_id: role.id },
      defaults: { user_id: user.id, role_id: role.id, status: "active" },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    if (assignment.status !== "active") {
      await assignment.update({ status: "active" });
    }
  }

  console.log(`✅ role_users: asignaciones reconciliadas (${SEED_ROLE_USERS.length}, ${created} nuevas)`);
  return created;
}
