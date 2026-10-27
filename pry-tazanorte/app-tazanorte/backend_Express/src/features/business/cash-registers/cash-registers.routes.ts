import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { CashRegistersController } from "./cash-registers.controller";

/** Rutas del feature CashRegisters (TurnoCaja) — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class CashRegistersRoutes {
  public cashRegistersController: CashRegistersController = new CashRegistersController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/turnos-caja").get(authenticate, authorize, this.cashRegistersController.getAll.bind(this.cashRegistersController));

    // getOne
    app.route("/api/turnos-caja/:id").get(authenticate, authorize, this.cashRegistersController.getOne.bind(this.cashRegistersController));

    // create
    app.route("/api/turnos-caja").post(authenticate, authorize, this.cashRegistersController.create.bind(this.cashRegistersController));

    // update (PUT / PATCH)
    app
      .route("/api/turnos-caja/:id")
      .put(authenticate, authorize, this.cashRegistersController.updatePut.bind(this.cashRegistersController))
      .patch(authenticate, authorize, this.cashRegistersController.updatePatch.bind(this.cashRegistersController));

    // delete físico
    app.route("/api/turnos-caja/:id").delete(authenticate, authorize, this.cashRegistersController.deletePhysical.bind(this.cashRegistersController));

    // delete lógico
    app.route("/api/turnos-caja/:id/deactivate").patch(authenticate, authorize, this.cashRegistersController.deleteLogical.bind(this.cashRegistersController));
  }
}
