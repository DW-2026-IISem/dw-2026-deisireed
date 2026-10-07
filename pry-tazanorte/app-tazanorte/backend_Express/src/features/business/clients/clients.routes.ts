import { Application } from "express";
import { ClientsController } from "./clients.controller";
import "./clients.swagger";

export class ClientsRoutes {
  public controller: ClientsController = new ClientsController();

  public routes(app: Application): void {
    app.route("/api/clientes")
      .get(this.controller.getAll.bind(this.controller))
      .post(this.controller.create.bind(this.controller));
  }
}
