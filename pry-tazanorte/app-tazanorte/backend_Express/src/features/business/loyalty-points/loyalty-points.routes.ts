import { Application } from "express";
import { LoyaltyPointsController } from "./loyalty-points.controller";

export class LoyaltyPointsRoutes {
  public controller: LoyaltyPointsController = new LoyaltyPointsController();

  public routes(app: Application): void {
    app.route("/api/puntos-fidelizacion")
      .get(this.controller.getAll)
      .post(this.controller.create);

    app.route("/api/puntos-fidelizacion/:id")
      .get(this.controller.getById)
      .put(this.controller.update)
      .delete(this.controller.delete);
  }
}
