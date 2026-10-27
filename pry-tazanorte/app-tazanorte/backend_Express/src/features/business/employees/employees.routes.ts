import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { EmployeesController } from "./employees.controller";

/** Rutas del feature Employees — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class EmployeesRoutes {
  public employeesController: EmployeesController = new EmployeesController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/empleados").get(authenticate, authorize, this.employeesController.getAll.bind(this.employeesController));

    // getOne
    app.route("/api/empleados/:id").get(authenticate, authorize, this.employeesController.getOne.bind(this.employeesController));

    // create
    app.route("/api/empleados").post(authenticate, authorize, this.employeesController.create.bind(this.employeesController));

    // update (PUT / PATCH)
    app
      .route("/api/empleados/:id")
      .put(authenticate, authorize, this.employeesController.updatePut.bind(this.employeesController))
      .patch(authenticate, authorize, this.employeesController.updatePatch.bind(this.employeesController));

    // delete físico
    app.route("/api/empleados/:id").delete(authenticate, authorize, this.employeesController.deletePhysical.bind(this.employeesController));

    // delete lógico
    app.route("/api/empleados/:id/deactivate").patch(authenticate, authorize, this.employeesController.deleteLogical.bind(this.employeesController));
  }
}
