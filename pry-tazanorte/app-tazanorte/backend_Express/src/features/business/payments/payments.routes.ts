import { Application } from "express";
import { PaymentsController } from "./payments.controller";
import "./payments.swagger";

export class PaymentsRoutes {
  public controller: PaymentsController = new PaymentsController();

  public routes(app: Application): void {
    app.route("/api/pagos")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));

    app.route("/api/pagos/:id")
      .get(this.controller.getById.bind(this.controller))
      .put(this.controller.update.bind(this.controller))
      .patch(this.controller.update.bind(this.controller))
      .delete(this.controller.delete.bind(this.controller));
  }
}
