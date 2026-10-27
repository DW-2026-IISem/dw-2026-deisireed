import { Response } from "express";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { AppError } from "../errors/app-error";

/**
 * Traduce cualquier error a una respuesta HTTP. **Único punto** del proyecto
 * donde se decide el mapeo error -> status.
 *
 * Lo usan los dos sitios que pueden fallar antes de llegar a un controller:
 *  - `BaseController.handleError` (handlers de los controllers);
 *  - los middlewares de acceso (`authenticate` / `authorize`), que responden
 *    401/403 sin pasar por un controller.
 *
 * Reglas:
 *  - `AppError`                    -> su `statusCode`.
 *  - Sequelize: clave única        -> 409 (red de seguridad si el service no lo comprobó).
 *  - Sequelize: clave foránea      -> 409 (p. ej. borrar físicamente un rol con usuarios).
 *  - Sequelize: validación         -> 400 (mensajes del modelo).
 *  - Cualquier otra cosa           -> 500 (el detalle solo en el cuerpo, nunca el stack).
 */
export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  // UniqueConstraintError hereda de ValidationError: se evalúa antes.
  if (error instanceof UniqueConstraintError) {
    res.status(409).json({ error: "Duplicate value", fields: Object.keys(error.fields ?? {}) });
    return;
  }
  if (error instanceof ForeignKeyConstraintError) {
    res.status(409).json({ error: "The record is referenced by other records (foreign key)" });
    return;
  }
  if (error instanceof ValidationError) {
    res.status(400).json({ error: "Validation error", details: error.errors.map((e) => e.message) });
    return;
  }
  res.status(500).json({ error: "Internal server error", detail: String(error) });
}
