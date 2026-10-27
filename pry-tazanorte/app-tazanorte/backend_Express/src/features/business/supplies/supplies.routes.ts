import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { SuppliesController } from "./supplies.controller";

/** Rutas del feature Supplies (Insumo) — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class SuppliesRoutes {
  public suppliesController: SuppliesController = new SuppliesController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/insumos").get(authenticate, authorize, this.suppliesController.getAll.bind(this.suppliesController));

    // getOne
    app.route("/api/insumos/:id").get(authenticate, authorize, this.suppliesController.getOne.bind(this.suppliesController));

    // create
    app.route("/api/insumos").post(authenticate, authorize, this.suppliesController.create.bind(this.suppliesController));

    // update (PUT / PATCH)
    app
      .route("/api/insumos/:id")
      .put(authenticate, authorize, this.suppliesController.updatePut.bind(this.suppliesController))
      .patch(authenticate, authorize, this.suppliesController.updatePatch.bind(this.suppliesController));

    // delete físico
    app.route("/api/insumos/:id").delete(authenticate, authorize, this.suppliesController.deletePhysical.bind(this.suppliesController));

    // delete lógico
    app.route("/api/insumos/:id/deactivate").patch(authenticate, authorize, this.suppliesController.deleteLogical.bind(this.suppliesController));
  }
}
