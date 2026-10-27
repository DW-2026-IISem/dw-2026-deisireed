import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { SupplyOrderItemsController } from "./supply-order-items.controller";

/** Rutas del feature SupplyOrderItems (InsumoPedidoDetalle) — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class SupplyOrderItemsRoutes {
  public supplyOrderItemsController: SupplyOrderItemsController = new SupplyOrderItemsController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/insumo-pedido-detalles").get(authenticate, authorize, this.supplyOrderItemsController.getAll.bind(this.supplyOrderItemsController));

    // getOne
    app.route("/api/insumo-pedido-detalles/:id").get(authenticate, authorize, this.supplyOrderItemsController.getOne.bind(this.supplyOrderItemsController));

    // create
    app.route("/api/insumo-pedido-detalles").post(authenticate, authorize, this.supplyOrderItemsController.create.bind(this.supplyOrderItemsController));

    // update (PUT / PATCH)
    app
      .route("/api/insumo-pedido-detalles/:id")
      .put(authenticate, authorize, this.supplyOrderItemsController.updatePut.bind(this.supplyOrderItemsController))
      .patch(authenticate, authorize, this.supplyOrderItemsController.updatePatch.bind(this.supplyOrderItemsController));

    // delete físico
    app.route("/api/insumo-pedido-detalles/:id").delete(authenticate, authorize, this.supplyOrderItemsController.deletePhysical.bind(this.supplyOrderItemsController));

    // delete lógico
    app.route("/api/insumo-pedido-detalles/:id/deactivate").patch(authenticate, authorize, this.supplyOrderItemsController.deleteLogical.bind(this.supplyOrderItemsController));
  }
}
