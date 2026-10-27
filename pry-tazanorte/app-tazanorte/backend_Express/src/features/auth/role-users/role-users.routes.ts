import { Application } from "express";
import { authenticate, authorize } from "../access";
import { RoleUsersController } from "./role-users.controller";

/**
 * Rutas del feature RoleUsers (asignaciones usuario ↔ rol).
 *
 * Modalidad: **JWT + RBAC** (`authenticate` + `authorize`) en todas las operaciones.
 */
export class RoleUsersRoutes {
  public roleUsersController: RoleUsersController = new RoleUsersController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/asignaciones-rol").get(authenticate, authorize, this.roleUsersController.getAll.bind(this.roleUsersController));

    // getOne
    app.route("/api/asignaciones-rol/:id").get(authenticate, authorize, this.roleUsersController.getOne.bind(this.roleUsersController));

    // asignar rol (create)
    app.route("/api/asignaciones-rol").post(authenticate, authorize, this.roleUsersController.assign.bind(this.roleUsersController));

    // retirar rol (delete lógico)
    app.route("/api/asignaciones-rol/:id/deactivate").patch(authenticate, authorize, this.roleUsersController.deactivate.bind(this.roleUsersController));

    // reactivar asignación
    app.route("/api/asignaciones-rol/:id/reactivate").patch(authenticate, authorize, this.roleUsersController.reactivate.bind(this.roleUsersController));
  }
}
