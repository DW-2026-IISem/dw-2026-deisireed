import { Application } from "express";
import { EmployeesController } from "./employees.controller";
import "./employees.swagger";

export class EmployeesRoutes {
  public controller: EmployeesController = new EmployeesController();

  public routes(app: Application): void {
    app.route("/api/empleados")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
