import { Application } from "express";
import { CashRegistersController } from "./cash-registers.controller";

export class CashRegistersRoutes {
  public cashRegistersController: CashRegistersController = new CashRegistersController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/turnos-caja")
      .get(this.cashRegistersController.getAll.bind(this.cashRegistersController));

    // getOne
    app
      .route("/api/turnos-caja/:id")
      .get(this.cashRegistersController.getOne.bind(this.cashRegistersController));

    // create
    app
      .route("/api/turnos-caja")
      .post(this.cashRegistersController.create.bind(this.cashRegistersController));

    // update (PUT / PATCH)
    app
      .route("/api/turnos-caja/:id")
      .put(this.cashRegistersController.updatePut.bind(this.cashRegistersController))
      .patch(this.cashRegistersController.updatePatch.bind(this.cashRegistersController));

    // delete físico
    app
      .route("/api/turnos-caja/:id")
      .delete(this.cashRegistersController.deletePhysical.bind(this.cashRegistersController));

    // delete lógico
    app
      .route("/api/turnos-caja/:id/deactivate")
      .patch(this.cashRegistersController.deleteLogical.bind(this.cashRegistersController));
  }
}
