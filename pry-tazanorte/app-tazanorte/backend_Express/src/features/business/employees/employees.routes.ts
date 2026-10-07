import { Application } from "express";
import { EmployeesController } from "./employees.controller";

export class EmployeesRoutes {
  public employeesController: EmployeesController = new EmployeesController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/empleados")
      .get(this.employeesController.getAll.bind(this.employeesController));

    // getOne
    app
      .route("/api/empleados/:id")
      .get(this.employeesController.getOne.bind(this.employeesController));

    // create
    app
      .route("/api/empleados")
      .post(this.employeesController.create.bind(this.employeesController));

    // update (PUT / PATCH)
    app
      .route("/api/empleados/:id")
      .put(this.employeesController.updatePut.bind(this.employeesController))
      .patch(this.employeesController.updatePatch.bind(this.employeesController));

    // delete físico
    app
      .route("/api/empleados/:id")
      .delete(this.employeesController.deletePhysical.bind(this.employeesController));

    // delete lógico
    app
      .route("/api/empleados/:id/deactivate")
      .patch(this.employeesController.deleteLogical.bind(this.employeesController));
  }
}
