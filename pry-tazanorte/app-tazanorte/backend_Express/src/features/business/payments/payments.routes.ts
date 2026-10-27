import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { PaymentsController } from "./payments.controller";

/** Rutas del feature Payments (Pago) — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class PaymentsRoutes {
  public paymentsController: PaymentsController = new PaymentsController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/pagos").get(authenticate, authorize, this.paymentsController.getAll.bind(this.paymentsController));

    // getOne
    app.route("/api/pagos/:id").get(authenticate, authorize, this.paymentsController.getOne.bind(this.paymentsController));

    // create
    app.route("/api/pagos").post(authenticate, authorize, this.paymentsController.create.bind(this.paymentsController));

    // update (PUT / PATCH)
    app
      .route("/api/pagos/:id")
      .put(authenticate, authorize, this.paymentsController.updatePut.bind(this.paymentsController))
      .patch(authenticate, authorize, this.paymentsController.updatePatch.bind(this.paymentsController));

    // delete físico
    app.route("/api/pagos/:id").delete(authenticate, authorize, this.paymentsController.deletePhysical.bind(this.paymentsController));

    // delete lógico
    app.route("/api/pagos/:id/deactivate").patch(authenticate, authorize, this.paymentsController.deleteLogical.bind(this.paymentsController));
  }
}
