import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { Routes } from "../routes";
import { swaggerSpec } from "./swagger";
import { testConnection } from "../database/db";

// Carga directa de documentaciones Swagger de cada módulo
import "../features/business/cash-registers/cash-registers.swagger";
import "../features/business/clients/clients.swagger";
import "../features/business/employees/employees.swagger";
import "../features/business/orders/orders.swagger";
import "../features/business/products/products.swagger";
import "../features/business/supplies/supplies.swagger";
import "../features/business/order-items/order-items.swagger";
import "../features/business/supply-order-items/supply-order-items.swagger";

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.connectDB();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.routePrv.routes(this.app);
  }

  private async connectDB(): Promise<void> {
    await testConnection();
  }

  public listen(port?: number): any {
    const PORT = port || Number(process.env.PORT) || 4000;
    return this.app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Swagger disponible en: http://localhost:${PORT}/api/docs`);
    });
  }
}

export default new App();
