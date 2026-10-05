import { Application } from "express";
import { ClientsController } from "./clients.controller";

export class ClientsRoutes {
  public clientsController: ClientsController = new ClientsController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/clientes")
      .get(this.clientsController.getAll.bind(this.clientsController));

    // getOne
    app
      .route("/api/clientes/:id")
      .get(this.clientsController.getOne.bind(this.clientsController));

    // create
    app
      .route("/api/clientes")
      .post(this.clientsController.create.bind(this.clientsController));
  }
}
