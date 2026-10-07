import { Request, Response } from "express";
import { AppError } from "../errors/app-error";

/**
 * Base de los controllers HTTP.
 *
 *  - `run`:         ejecuta el cuerpo del handler y traduce el error a HTTP.
 *  - `paramId`:     lee y valida el `:id` de la URL.
 *  - `handleError`: mapea errores conocidos a su status y lo demás a 500.
 */
export abstract class BaseController {
  protected async run(res: Response, work: () => Promise<void>): Promise<void> {
    try {
      await work();
    } catch (error) {
      this.handleError(res, error);
    }
  }

  protected paramId(req: Request): number {
    const raw = req.params.id;
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (!value || !/^\d+$/.test(value) || Number(value) < 1) {
      throw new AppError(400, "Invalid id: must be a positive integer");
    }
    return Number(value);
  }

  /**
   * Mapea errores:
   *  - `AppError`                        -> su status
   *  - Sequelize validation              -> 400
   *  - Sequelize unique / foreign key    -> 409
   *  - cualquier otro                    -> 500
   */
  protected handleError(res: Response, error: unknown): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    const name = (error as { name?: string })?.name;
    if (name === "SequelizeValidationError") {
      res.status(400).json({ error: (error as Error).message });
      return;
    }
    if (name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ error: "Duplicate value for a unique field" });
      return;
    }
    if (name === "SequelizeForeignKeyConstraintError") {
      res.status(409).json({
        error: "Operation conflicts with a related record (it is referenced by other records)",
      });
      return;
    }

    res.status(500).json({ error: "Internal server error", detail: String(error) });
  }
}
