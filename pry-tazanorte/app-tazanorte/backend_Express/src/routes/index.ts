import { ClientsRoutes } from "../features/business/clients/clients.routes";
import { ProductsRoutes } from "../features/business/products/products.routes";

export class Routes {
  public clientsRoutes: ClientsRoutes = new ClientsRoutes();
  public productsRoutes: ProductsRoutes = new ProductsRoutes();
}
