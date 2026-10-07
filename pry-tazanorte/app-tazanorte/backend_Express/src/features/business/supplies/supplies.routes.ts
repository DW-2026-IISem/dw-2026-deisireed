import { Application } from "express";
import { SuppliesController } from "./supplies.controller";

export class SuppliesRoutes {
  public suppliesController: SuppliesController = new SuppliesController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/insumos")
      .get(this.suppliesController.getAll.bind(this.suppliesController));

    // getOne
    app
      .route("/api/insumos/:id")
      .get(this.suppliesController.getOne.bind(this.suppliesController));

    // create
    app
      .route("/api/insumos")
      .post(this.suppliesController.create.bind(this.suppliesController));

    // update (PUT / PATCH)
    app
      .route("/api/insumos/:id")
      .put(this.suppliesController.updatePut.bind(this.suppliesController))
      .patch(this.suppliesController.updatePatch.bind(this.suppliesController));

    // delete físico
    app
      .route("/api/insumos/:id")
      .delete(this.suppliesController.deletePhysical.bind(this.suppliesController));

    // delete lógico
    app
      .route("/api/insumos/:id/deactivate")
      .patch(this.suppliesController.deleteLogical.bind(this.suppliesController));
  }
}
