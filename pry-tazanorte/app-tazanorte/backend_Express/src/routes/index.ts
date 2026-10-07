import { ClientsRoutes } from "../features/business/clients/clients.routes";
import { ProductsRoutes } from "../features/business/products/products.routes";
import { EmployeesRoutes } from "../features/business/employees/employees.routes";
import { SuppliesRoutes } from "../features/business/supplies/supplies.routes";
import { CashRegistersRoutes } from "../features/business/cash-registers/cash-registers.routes";
import { OrdersRoutes } from "../features/business/orders/orders.routes";
import { OrderItemsRoutes } from "../features/business/order-items/order-items.routes";
import { SupplyOrderItemsRoutes } from "../features/business/supply-order-items/supply-order-items.routes";
import { PaymentsRoutes } from "../features/business/payments/payments.routes";

export class Routes {
  public clientsRoutes: ClientsRoutes = new ClientsRoutes();
  public productsRoutes: ProductsRoutes = new ProductsRoutes();
  public employeesRoutes: EmployeesRoutes = new EmployeesRoutes();
  public suppliesRoutes: SuppliesRoutes = new SuppliesRoutes();
  public cashRegistersRoutes: CashRegistersRoutes = new CashRegistersRoutes();
  public ordersRoutes: OrdersRoutes = new OrdersRoutes();
  public orderItemsRoutes: OrderItemsRoutes = new OrderItemsRoutes();
  public supplyOrderItemsRoutes: SupplyOrderItemsRoutes = new SupplyOrderItemsRoutes();
  public paymentsRoutes: PaymentsRoutes = new PaymentsRoutes();

  public routes(app: any): void {
    this.clientsRoutes.routes(app);
    this.productsRoutes.routes(app);
    this.employeesRoutes.routes(app);
    this.suppliesRoutes.routes(app);
    this.cashRegistersRoutes.routes(app);
    this.ordersRoutes.routes(app);
    this.orderItemsRoutes.routes(app);
    this.supplyOrderItemsRoutes.routes(app);
    this.paymentsRoutes.routes(app);
  }
}
