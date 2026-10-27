import { faker } from "@faker-js/faker";
import { User } from "./user.model";

/**
 * Seeder de usuarios (`users`).
 *
 * Crea **un usuario canónico por rol de TazaNorte** (el rol se asigna en ISS-19):
 *
 * | username     | password         | rol        |
 * |--------------|------------------|------------|
 * | `admin`      | `Admin123!`      | ADMIN      |
 * | `caja`       | `Caja123!`       | CAJA       |
 * | `barista`    | `Barista123!`    | BARISTA    |
 * | `bodega`     | `Bodega123!`     | BODEGA     |
 * | `supervisor` | `Supervisor123!` | SUPERVISOR |
 *
 * Si `count` > 5, se añaden usuarios aleatorios **sin rol**: sirven para
 * comprobar que estar autenticado no basta (recibirán 403 en todo).
 *
 * Las contraseñas se guardan como **hash** (hook `beforeCreate` del modelo).
 * Idempotente por `username`: reactiva los canónicos si quedaron inactivos.
 */
export const SEED_USERS = [
  { username: "admin", email: "admin@tazanorte.local", password: "Admin123!" },
  { username: "caja", email: "caja@tazanorte.local", password: "Caja123!" },
  { username: "barista", email: "barista@tazanorte.local", password: "Barista123!" },
  { username: "bodega", email: "bodega@tazanorte.local", password: "Bodega123!" },
  { username: "supervisor", email: "supervisor@tazanorte.local", password: "Supervisor123!" },
] as const;

export async function seedUsers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  users: count=0, se omite");
    return 0;
  }

  let created = 0;

  for (const item of SEED_USERS) {
    const [user, wasCreated] = await User.findOrCreate({
      where: { username: item.username },
      defaults: {
        username: item.username,
        email: item.email,
        password: item.password,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    // Reconciliación: `npm run db:seed` devuelve siempre el laboratorio a un estado operable.
    if (user.status !== "active") {
      await user.update({ status: "active" });
    }
  }

  // Extras sin rol: solo si aún no existen (idempotente).
  const total = await User.count();
  const extras = Math.max(0, count - Math.max(total, SEED_USERS.length));
  for (let i = 0; i < extras; i++) {
    const username = `invitado.${faker.string.alphanumeric(6)}`.toLowerCase();
    await User.create({
      username,
      email: `${username}@tazanorte.local`,
      password: "Invitado123!",
      avatar: null,
      status: "active",
    });
    created++;
  }

  console.log(`✅ users: insertados ${created} usuario(s) (${SEED_USERS.length} canónicos + ${extras} sin rol)`);
  return created;
}
