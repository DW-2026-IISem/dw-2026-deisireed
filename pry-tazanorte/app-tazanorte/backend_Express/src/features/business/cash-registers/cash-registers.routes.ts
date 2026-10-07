import { Application } from "express";
import { CashRegistersController } from "./cash-registers.controller";
import "./cash-registers.swagger";

export class CashRegistersRoutes {
  public controller: CashRegistersController = new CashRegistersController();

  public routes(app: Application): void {
    app.route("/api/cajas")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
