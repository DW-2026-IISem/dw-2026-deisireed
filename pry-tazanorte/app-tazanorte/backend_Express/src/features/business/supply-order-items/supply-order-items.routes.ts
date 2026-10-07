import { Application } from "express";
import { SupplyOrderItemsController } from "./supply-order-items.controller";
import "./supply-order-items.swagger";

export class SupplyOrderItemsRoutes {
  public controller: SupplyOrderItemsController = new SupplyOrderItemsController();

  public routes(app: Application): void {
    app.route("/api/insumo-pedido-detalles")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
