import { Request } from "express";
import { AppError } from "../errors/app-error";

/** Identidad que `authenticate` deja en `req.auth`. */
export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  /** `jti` del access token con el que se autenticó. */
  tokenId?: string;
}

/** Devuelve la identidad de la petición o falla con 401. */
export function requireAuthUser(req: Request): AuthUser {
  if (!req.auth) {
    throw new AppError(401, "Authentication required");
  }
  return req.auth;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Identidad resuelta por `authenticate`. `undefined` = ruta OPEN. */
      auth?: AuthUser;
    }
  }
}

export {};
