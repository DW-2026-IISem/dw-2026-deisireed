import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { OrdersController } from "./orders.controller";

export class OrdersRoutes {
  public ordersController: OrdersController = new OrdersController();

  public routes(app: Application): void {
    // ================== JWT + RBAC (authenticate + authorize) ==================

    // getAll
    app.route("/api/pedidos").get(authenticate, authorize, this.ordersController.getAll.bind(this.ordersController));

    // getOne
    app.route("/api/pedidos/:id").get(authenticate, authorize, this.ordersController.getOne.bind(this.ordersController));

    // create
    app.route("/api/pedidos").post(authenticate, authorize, this.ordersController.create.bind(this.ordersController));

    // update (PUT / PATCH)
    app
      .route("/api/pedidos/:id")
      .put(authenticate, authorize, this.ordersController.updatePut.bind(this.ordersController))
      .patch(authenticate, authorize, this.ordersController.updatePatch.bind(this.ordersController));

    // cambio de estado
    app.route("/api/pedidos/:id/estado").patch(authenticate, authorize, this.ordersController.updateState.bind(this.ordersController));

    // delete físico
    app.route("/api/pedidos/:id").delete(authenticate, authorize, this.ordersController.deletePhysical.bind(this.ordersController));

    // delete lógico (cancelación)
    app.route("/api/pedidos/:id/deactivate").patch(authenticate, authorize, this.ordersController.deleteLogical.bind(this.ordersController));
  }
}
