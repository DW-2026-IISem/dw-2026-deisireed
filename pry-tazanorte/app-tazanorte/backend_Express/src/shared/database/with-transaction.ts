import { Transaction } from "sequelize";
import { sequelize } from "../../database/db";

/** Ejecuta `work` dentro de una transacción gestionada (commit/rollback automáticos). */
export async function withTransaction<T>(work: (t: Transaction) => Promise<T>): Promise<T> {
  return sequelize.transaction(async (t) => work(t));
}
