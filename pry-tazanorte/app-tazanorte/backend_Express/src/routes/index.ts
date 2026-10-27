import { ClientsRoutes } from "../features/business/clients/clients.routes";
import { ProductsRoutes } from "../features/business/products/products.routes";
import { EmployeesRoutes } from "../features/business/employees/employees.routes";
import { SuppliesRoutes } from "../features/business/supplies/supplies.routes";
import { CashRegistersRoutes } from "../features/business/cash-registers/cash-registers.routes";
import { OrdersRoutes } from "../features/business/orders/orders.routes";
import { OrderItemsRoutes } from "../features/business/order-items/order-items.routes";
import { SupplyOrderItemsRoutes } from "../features/business/supply-order-items/supply-order-items.routes";
import { PaymentsRoutes } from "../features/business/payments/payments.routes";
import { LoyaltyPointsRoutes } from "../features/business/loyalty-points/loyalty-points.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";
import { RolesRoutes } from "../features/auth/roles/roles.routes";
import { ResourcesRoutes } from "../features/auth/resources/resources.routes";
import { RoleUsersRoutes } from "../features/auth/role-users/role-users.routes";
import { ResourceRolesRoutes } from "../features/auth/resource-roles/resource-roles.routes";
import { RefreshTokensRoutes } from "../features/auth/refresh-tokens/refresh-tokens.routes";
import { SessionRoutes } from "../features/auth/session/session.routes";

/**
 * Agregador de rutas: solo instancia cada feature.
 * Quien las registra (y en qué orden) es `App.routes()` en `config/index.ts`.
 */
export class Routes {
  // Fase I — Business
  public clientsRoutes: ClientsRoutes = new ClientsRoutes();
  public productsRoutes: ProductsRoutes = new ProductsRoutes();
  public employeesRoutes: EmployeesRoutes = new EmployeesRoutes();
  public suppliesRoutes: SuppliesRoutes = new SuppliesRoutes();
  public cashRegistersRoutes: CashRegistersRoutes = new CashRegistersRoutes();
  public ordersRoutes: OrdersRoutes = new OrdersRoutes();
  public orderItemsRoutes: OrderItemsRoutes = new OrderItemsRoutes();
  public supplyOrderItemsRoutes: SupplyOrderItemsRoutes = new SupplyOrderItemsRoutes();
  public paymentsRoutes: PaymentsRoutes = new PaymentsRoutes();
  public loyaltyPointsRoutes: LoyaltyPointsRoutes = new LoyaltyPointsRoutes();

  // Fase II — Auth con RBAC (se agregan en ISS-17 … ISS-22)
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public rolesRoutes: RolesRoutes = new RolesRoutes();
  public resourcesRoutes: ResourcesRoutes = new ResourcesRoutes();
  public roleUsersRoutes: RoleUsersRoutes = new RoleUsersRoutes();
  public resourceRolesRoutes: ResourceRolesRoutes = new ResourceRolesRoutes();
  public refreshTokensRoutes: RefreshTokensRoutes = new RefreshTokensRoutes();
  public sessionRoutes: SessionRoutes = new SessionRoutes();
}
