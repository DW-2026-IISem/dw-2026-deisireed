import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ProductsController } from "./products.controller";

/** Rutas del feature Products — JWT + RBAC en todas las operaciones (authenticate + authorize). */
export class ProductsRoutes {
  public productsController: ProductsController = new ProductsController();

  public routes(app: Application): void {
    // getAll
    app.route("/api/productos").get(authenticate, authorize, this.productsController.getAll.bind(this.productsController));

    // getOne
    app.route("/api/productos/:id").get(authenticate, authorize, this.productsController.getOne.bind(this.productsController));

    // create
    app.route("/api/productos").post(authenticate, authorize, this.productsController.create.bind(this.productsController));

    // update (PUT / PATCH)
    app
      .route("/api/productos/:id")
      .put(authenticate, authorize, this.productsController.updatePut.bind(this.productsController))
      .patch(authenticate, authorize, this.productsController.updatePatch.bind(this.productsController));

    // delete físico
    app.route("/api/productos/:id").delete(authenticate, authorize, this.productsController.deletePhysical.bind(this.productsController));

    // delete lógico
    app.route("/api/productos/:id/deactivate").patch(authenticate, authorize, this.productsController.deleteLogical.bind(this.productsController));
  }
}
