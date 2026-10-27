import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { LoyaltyPointsController } from "./loyalty-points.controller";

/** Rutas del feature LoyaltyPoints (MovimientoPuntos) — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class LoyaltyPointsRoutes {
  public loyaltyPointsController: LoyaltyPointsController = new LoyaltyPointsController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/puntos-fidelizacion").get(authenticate, authorize, this.loyaltyPointsController.getAll.bind(this.loyaltyPointsController));

    // getOne
    app.route("/api/puntos-fidelizacion/:id").get(authenticate, authorize, this.loyaltyPointsController.getOne.bind(this.loyaltyPointsController));

    // saldo del cliente (`:id` = id del cliente)
    app
      .route("/api/puntos-fidelizacion/cliente/:id/saldo")
      .get(authenticate, authorize, this.loyaltyPointsController.getBalance.bind(this.loyaltyPointsController));

    // create
    app.route("/api/puntos-fidelizacion").post(authenticate, authorize, this.loyaltyPointsController.create.bind(this.loyaltyPointsController));

    // update (PUT / PATCH)
    app
      .route("/api/puntos-fidelizacion/:id")
      .put(authenticate, authorize, this.loyaltyPointsController.updatePut.bind(this.loyaltyPointsController))
      .patch(authenticate, authorize, this.loyaltyPointsController.updatePatch.bind(this.loyaltyPointsController));

    // delete físico
    app.route("/api/puntos-fidelizacion/:id").delete(authenticate, authorize, this.loyaltyPointsController.deletePhysical.bind(this.loyaltyPointsController));

    // delete lógico (anular movimiento)
    app.route("/api/puntos-fidelizacion/:id/deactivate").patch(authenticate, authorize, this.loyaltyPointsController.deleteLogical.bind(this.loyaltyPointsController));
  }
}
