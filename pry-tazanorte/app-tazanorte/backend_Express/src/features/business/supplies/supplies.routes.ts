import { Application } from "express";
import { SuppliesController } from "./supplies.controller";
import "./supplies.swagger";

export class SuppliesRoutes {
  public controller: SuppliesController = new SuppliesController();

  public routes(app: Application): void {
    app.route("/api/insumos")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
