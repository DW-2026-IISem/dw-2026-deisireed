import { ClientsRoutes } from "../features/business/clients/clients.routes";
import { ProductsRoutes } from "../features/business/products/products.routes";
import { EmployeesRoutes } from "../features/business/employees/employees.routes";
import { SuppliesRoutes } from "../features/business/supplies/supplies.routes";

export class Routes {
  public clientsRoutes: ClientsRoutes = new ClientsRoutes();
  public productsRoutes: ProductsRoutes = new ProductsRoutes();
  public employeesRoutes: EmployeesRoutes = new EmployeesRoutes();
  public suppliesRoutes: SuppliesRoutes = new SuppliesRoutes();
}
