import { Application } from "express";
import { OrderItemsController } from "./order-items.controller";

export class OrderItemsRoutes {
  public orderItemsController: OrderItemsController = new OrderItemsController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app.route("/api/detalle-pedidos").get(this.orderItemsController.getAll.bind(this.orderItemsController));

    // getOne
    app.route("/api/detalle-pedidos/:id").get(this.orderItemsController.getOne.bind(this.orderItemsController));

    // create
    app.route("/api/detalle-pedidos").post(this.orderItemsController.create.bind(this.orderItemsController));

    // update (PUT / PATCH)
    app
      .route("/api/detalle-pedidos/:id")
      .put(this.orderItemsController.updatePut.bind(this.orderItemsController))
      .patch(this.orderItemsController.updatePatch.bind(this.orderItemsController));

    // delete físico
    app.route("/api/detalle-pedidos/:id").delete(this.orderItemsController.deletePhysical.bind(this.orderItemsController));

    // delete lógico
    app.route("/api/detalle-pedidos/:id/deactivate").patch(this.orderItemsController.deleteLogical.bind(this.orderItemsController));
  }
}
