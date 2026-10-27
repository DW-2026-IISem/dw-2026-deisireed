import { Application } from "express";
import { authenticate, authorize } from "../access";
import { ResourceRolesController } from "./resource-roles.controller";

/**
 * Rutas del feature ResourceRoles (concesiones rol ↔ recurso).
 *
 * Modalidad: **JWT + RBAC** (`authenticate` + `authorize`) en todas las operaciones.
 */
export class ResourceRolesRoutes {
  public resourceRolesController: ResourceRolesController = new ResourceRolesController();

  public routes(app: Application): void {
    // getAll (filtros ?role_id= y ?resource_id=)
    app.route("/api/concesiones-rol").get(authenticate, authorize, this.resourceRolesController.getAll.bind(this.resourceRolesController));

    // getOne
    app.route("/api/concesiones-rol/:id").get(authenticate, authorize, this.resourceRolesController.getOne.bind(this.resourceRolesController));

    // conceder recurso a rol (create)
    app.route("/api/concesiones-rol").post(authenticate, authorize, this.resourceRolesController.grant.bind(this.resourceRolesController));

    // retirar permiso (delete lógico)
    app.route("/api/concesiones-rol/:id/deactivate").patch(authenticate, authorize, this.resourceRolesController.deactivate.bind(this.resourceRolesController));

    // reactivar permiso
    app.route("/api/concesiones-rol/:id/reactivate").patch(authenticate, authorize, this.resourceRolesController.reactivate.bind(this.resourceRolesController));
  }
}
