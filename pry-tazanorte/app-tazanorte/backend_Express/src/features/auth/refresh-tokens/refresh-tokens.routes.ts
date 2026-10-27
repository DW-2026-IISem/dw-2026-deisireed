import { Application } from "express";
import { authenticate } from "../access";
import { RefreshTokensController } from "./refresh-tokens.controller";

/**
 * Rutas del feature RefreshTokens (sesiones propias).
 *
 * Modalidad: **JWT** (solo `authenticate`, sin `authorize`). No son recursos RBAC:
 * cualquier usuario autenticado gestiona **sus** sesiones, y solo las suyas.
 */
export class RefreshTokensRoutes {
  public refreshTokensController: RefreshTokensController = new RefreshTokensController();

  public routes(app: Application): void {
    // getAll (sesiones activas propias)
    app.route("/api/sesiones").get(authenticate, this.refreshTokensController.getAll.bind(this.refreshTokensController));

    // revocar todas las sesiones propias (ruta literal: va ANTES de /:id)
    app.route("/api/sesiones/deactivate-all").patch(authenticate, this.refreshTokensController.revokeAll.bind(this.refreshTokensController));

    // getOne
    app.route("/api/sesiones/:id").get(authenticate, this.refreshTokensController.getOne.bind(this.refreshTokensController));

    // revocar una sesión propia
    app.route("/api/sesiones/:id/deactivate").patch(authenticate, this.refreshTokensController.revokeOne.bind(this.refreshTokensController));

    // purgar sesiones propias revocadas o expiradas
    app.route("/api/sesiones").delete(authenticate, this.refreshTokensController.purge.bind(this.refreshTokensController));
  }
}
