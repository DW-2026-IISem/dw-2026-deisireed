import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";
import { isOperationGranted, normalizePath } from "../../../shared/auth/resource-match";
import { ResourceRolesRepository } from "../resource-roles/resource-roles.repository";

const resourceRolesRepository = new ResourceRolesRepository();

/**
 * Middleware **authorize** — modalidad JWT + RBAC. Va **después** de `authenticate`.
 *
 * 1. Toma el par real de la petición: `(req.method, req.originalUrl)`.
 * 2. Consulta los permisos efectivos del usuario en **cada** petición
 *    (por eso retirar un rol o una concesión tiene efecto inmediato).
 * 3. Casa la petición contra los patrones concedidos (`/api/pedidos/:id`).
 * 4. Sin coincidencia -> **403** (deny by default).
 */
export async function authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.auth) {
      throw new AppError(401, "Authentication required");
    }

    const method = req.method.toUpperCase();
    const path = normalizePath(req.originalUrl);
    const granted = await resourceRolesRepository.findEffectiveForUser(req.auth.id);

    if (!isOperationGranted(granted, method, path)) {
      throw new AppError(403, `Forbidden: no grant for ${method} ${path}`);
    }
    next();
  } catch (error) {
    sendError(res, error);
  }
}
