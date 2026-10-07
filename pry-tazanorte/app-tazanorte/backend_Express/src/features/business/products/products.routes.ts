import { Application } from "express";
import { ProductsController } from "./products.controller";
import "./products.swagger";

export class ProductsRoutes {
  public controller: ProductsController = new ProductsController();

  public routes(app: Application): void {
    app.route("/api/productos")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
