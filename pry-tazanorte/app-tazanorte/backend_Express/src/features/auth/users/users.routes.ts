import { Application } from "express";
import { authenticate, authorize } from "../access";
import { UsersController } from "./users.controller";

/**
 * Rutas del feature Users.
 *
 * Modalidad: **JWT + RBAC** (`authenticate` + `authorize`) en todas las operaciones.
 */
export class UsersRoutes {
  public usersController: UsersController = new UsersController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/usuarios").get(authenticate, authorize, this.usersController.getAll.bind(this.usersController));

    // getOne
    app.route("/api/usuarios/:id").get(authenticate, authorize, this.usersController.getOne.bind(this.usersController));

    // create
    app.route("/api/usuarios").post(authenticate, authorize, this.usersController.create.bind(this.usersController));

    // update (PUT / PATCH)
    app
      .route("/api/usuarios/:id")
      .put(authenticate, authorize, this.usersController.updatePut.bind(this.usersController))
      .patch(authenticate, authorize, this.usersController.updatePatch.bind(this.usersController));

    // delete físico
    app.route("/api/usuarios/:id").delete(authenticate, authorize, this.usersController.deletePhysical.bind(this.usersController));

    // delete lógico
    app.route("/api/usuarios/:id/deactivate").patch(authenticate, authorize, this.usersController.deleteLogical.bind(this.usersController));

    // cambio de contraseña
    app.route("/api/usuarios/:id/password").patch(authenticate, authorize, this.usersController.changePassword.bind(this.usersController));

    // permisos efectivos del usuario
    app.route("/api/usuarios/:id/permisos").get(authenticate, authorize, this.usersController.getEffectivePermissions.bind(this.usersController));
  }
}
