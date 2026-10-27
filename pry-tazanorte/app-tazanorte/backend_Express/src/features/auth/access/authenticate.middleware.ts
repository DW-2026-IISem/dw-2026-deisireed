import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";
import { extractBearerToken, verifyAccessToken } from "../../../shared/auth/jwt";
import { UsersRepository } from "../users/users.repository";

const usersRepository = new UsersRepository();

/**
 * Middleware **authenticate** — modalidad JWT.
 *
 * 1. Lee `Authorization: Bearer <token>` (RFC 6750).      -> 401 si falta.
 * 2. Verifica firma, algoritmo, `iss`, `aud`, `exp`, `sub`, `jti`. -> 401 si falla.
 * 3. **Revalida en BD** que el usuario existe y está activo -> 401 si no.
 *    (Un usuario desactivado pierde el acceso al instante, aunque su token no
 *    haya caducado.)
 * 4. Deja la identidad en `req.auth` y continúa.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      throw new AppError(401, "Missing Bearer token");
    }

    const payload = verifyAccessToken(token);

    // Defensa en profundidad: `verifyAccessToken` ya garantiza que `sub` es un
    // entero positivo; se vuelve a comprobar para no enviar nunca un `NaN` al repositorio.
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) {
      throw new AppError(401, "Invalid or expired access token");
    }

    const user = await usersRepository.findById(userId);
    if (!user || user.status !== "active") {
      throw new AppError(401, "User is not active");
    }

    req.auth = { id: user.id, username: user.username, email: user.email, tokenId: payload.jti };
    next();
  } catch (error) {
    sendError(res, error);
  }
}
