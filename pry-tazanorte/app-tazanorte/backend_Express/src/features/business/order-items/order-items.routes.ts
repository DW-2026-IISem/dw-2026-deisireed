import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { OrderItemsController } from "./order-items.controller";

/** Rutas del feature OrderItems (PedidoDetalle) — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class OrderItemsRoutes {
  public orderItemsController: OrderItemsController = new OrderItemsController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/detalle-pedidos").get(authenticate, authorize, this.orderItemsController.getAll.bind(this.orderItemsController));

    // getOne
    app.route("/api/detalle-pedidos/:id").get(authenticate, authorize, this.orderItemsController.getOne.bind(this.orderItemsController));

    // create
    app.route("/api/detalle-pedidos").post(authenticate, authorize, this.orderItemsController.create.bind(this.orderItemsController));

    // update (PUT / PATCH)
    app
      .route("/api/detalle-pedidos/:id")
      .put(authenticate, authorize, this.orderItemsController.updatePut.bind(this.orderItemsController))
      .patch(authenticate, authorize, this.orderItemsController.updatePatch.bind(this.orderItemsController));

    // delete físico
    app.route("/api/detalle-pedidos/:id").delete(authenticate, authorize, this.orderItemsController.deletePhysical.bind(this.orderItemsController));

    // delete lógico
    app.route("/api/detalle-pedidos/:id/deactivate").patch(authenticate, authorize, this.orderItemsController.deleteLogical.bind(this.orderItemsController));
  }
}
