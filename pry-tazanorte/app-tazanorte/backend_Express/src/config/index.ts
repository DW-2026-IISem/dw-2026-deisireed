import express, { Application } from "express";
import cors from "cors";
import { setupSwagger, swaggerSpec } from "./swagger";
import { Routes } from "../routes";

// Importación directa e incondicional de los 9 archivos Swagger
import "../features/business/clients/clients.swagger";
import "../features/business/products/products.swagger";
import "../features/business/employees/employees.swagger";
import "../features/business/supplies/supplies.swagger";
import "../features/business/cash-registers/cash-registers.swagger";
import "../features/business/orders/orders.swagger";
import "../features/business/order-items/order-items.swagger";
import "../features/business/supply-order-items/supply-order-items.swagger";
import "../features/business/payments/payments.swagger";

// tazanorte · Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones
import "../features/auth/users/user.model";
import "../features/auth/roles/role.model";
import "../features/auth/resources/resource.model";
import "../features/auth/role-users/role-user.model";
import "../features/auth/resource-roles/resource-role.model";
import "../features/auth/refresh-tokens/refresh-token.model";
import "../features/auth/rbac.associations";

export class App {
  public app: Application;
  public routesPrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routesPrv.routes(this.app);
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    setupSwagger(this.app);
  }
}

export { setupSwagger, swaggerSpec };
