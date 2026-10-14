
import { Application } from "express";
import { OrderItemsController } from "./order-items.controller";
import "./order-items.swagger";

export class OrderItemsRoutes {
  public controller: OrderItemsController = new OrderItemsController();

  public routes(app: Application): void {
    app.route("/api/pedido-detalles")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));

    app.route("/api/pedido-detalles/:id")
      .get(this.controller.getOne.bind(this.controller))
      .put(this.controller.updatePut.bind(this.controller))
      .patch(this.controller.updatePatch.bind(this.controller))
      .delete(this.controller.deletePhysical.bind(this.controller));

    app.route("/api/pedido-detalles/:id/deactivate")
      .patch(this.controller.deleteLogical.bind(this.controller));
  }
}

