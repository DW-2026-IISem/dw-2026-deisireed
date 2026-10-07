import { Application } from "express";
import { OrdersController } from "./orders.controller";

export class OrdersRoutes {
  public ordersController: OrdersController = new OrdersController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app.route("/api/pedidos").get(this.ordersController.getAll.bind(this.ordersController));

    // getOne
    app.route("/api/pedidos/:id").get(this.ordersController.getOne.bind(this.ordersController));

    // create
    app.route("/api/pedidos").post(this.ordersController.create.bind(this.ordersController));

    // update (PUT / PATCH)
    app
      .route("/api/pedidos/:id")
      .put(this.ordersController.updatePut.bind(this.ordersController))
      .patch(this.ordersController.updatePatch.bind(this.ordersController));

    // cambio de estado
    app.route("/api/pedidos/:id/estado").patch(this.ordersController.updateState.bind(this.ordersController));

    // delete físico
    app.route("/api/pedidos/:id").delete(this.ordersController.deletePhysical.bind(this.ordersController));

    // delete lógico (cancelación)
    app.route("/api/pedidos/:id/deactivate").patch(this.ordersController.deleteLogical.bind(this.ordersController));
  }
}
