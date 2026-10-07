import { Application } from "express";
import { OrderItemsController } from "./order-items.controller";
import "./order-items.swagger";

export class OrderItemsRoutes {
  public controller: OrderItemsController = new OrderItemsController();

  public routes(app: Application): void {
    app.route("/api/pedido-detalles")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
