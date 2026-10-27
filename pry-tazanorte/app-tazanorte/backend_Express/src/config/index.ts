import dotenv from "dotenv";
import express, { Application, ErrorRequestHandler } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
// Fase I — Business: modelos (padres → hijos) y después las asociaciones
import "../features/business/clients/client.model";
import "../features/business/products/product.model";
import "../features/business/employees/employee.model";
import "../features/business/supplies/supply.model";
import "../features/business/cash-registers/cash-register.model";
import "../features/business/orders/order.model";
import "../features/business/order-items/order-item.model";
import "../features/business/supply-order-items/supply-order-item.model";
import "../features/business/payments/payment.model";
import "../features/business/loyalty-points/loyalty-point.model";
import "../features/business/cash-registers/cash-registers.associations";
import "../features/business/orders/orders.associations";
import "../features/business/order-items/order-items.associations";
import "../features/business/supply-order-items/supply-order-items.associations";
import "../features/business/loyalty-points/loyalty-points.associations";
// Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones
// (las asociaciones referencian los modelos, no al revés).
import "../features/auth/users/user.model";
import "../features/auth/roles/role.model";
import "../features/auth/resources/resource.model";
import "../features/auth/role-users/role-user.model";
import "../features/auth/resource-roles/resource-role.model";
import "../features/auth/refresh-tokens/refresh-token.model";
import "../features/auth/rbac.associations";
import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
    this.errorHandling();
  }

  private settings(): void {
    this.app.set("port", this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // Fase I — Business (SIN AUTH; pasan a JWT + RBAC en la Fase II)
    this.routePrv.clientsRoutes.routes(this.app);
    this.routePrv.productsRoutes.routes(this.app);
    this.routePrv.employeesRoutes.routes(this.app);
    this.routePrv.suppliesRoutes.routes(this.app);
    this.routePrv.cashRegistersRoutes.routes(this.app);
    this.routePrv.ordersRoutes.routes(this.app);
    this.routePrv.orderItemsRoutes.routes(this.app);
    this.routePrv.supplyOrderItemsRoutes.routes(this.app);
    this.routePrv.paymentsRoutes.routes(this.app);
    this.routePrv.loyaltyPointsRoutes.routes(this.app);

    // Fase II — Auth con RBAC
    // `sessionRoutes` registra los endpoints OPEN/JWT (login, refresh, logout,
    // perfil, permisos); el resto son modalidad JWT + RBAC.
    this.routePrv.sessionRoutes.routes(this.app);
    this.routePrv.usersRoutes.routes(this.app);
    this.routePrv.rolesRoutes.routes(this.app);
    this.routePrv.resourcesRoutes.routes(this.app);
    this.routePrv.roleUsersRoutes.routes(this.app);
    this.routePrv.resourceRolesRoutes.routes(this.app);
    this.routePrv.refreshTokensRoutes.routes(this.app);
  }

  private docs(): void {
    setupSwagger(this.app);
  }

  /**
   * Errores que ocurren **antes** de llegar a un controller (p. ej. JSON
   * malformado). Sin este manejador Express responde un HTML con el stack.
   * Debe registrarse **después** de las rutas (aridad de 4 argumentos).
   */
  private errorHandling(): void {
    const bodyErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({ error: "Malformed JSON body" });
        return;
      }
      next(err);
    };
    this.app.use(bodyErrorHandler);
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // Lab: sync crea/altera tablas desde los modelos.
      const force = process.env.DB_SYNC_FORCE === "true";
      const isMysql =
        sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";

      if (isMysql) {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      }
      try {
        await sequelize.sync({ force, alter: !force });
      } finally {
        if (isMysql) {
          await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        }
      }

      console.log(
        force
          ? "📦 Base de datos recreada (DB_SYNC_FORCE=true)"
          : "📦 Base de datos sincronizada exitosamente"
      );
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    // Primero la BD (conexión + sync), después abrir el puerto.
    await this.dbConnection();
    await this.app.listen(this.app.get("port"));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get("port")}`);
  }
}
