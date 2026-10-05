import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateClientDto } from "./dto";
import { ClientsService } from "./clients.service";

/**
 * Capa Controller del feature Clients.
 * Solo HTTP: lee req, llama al service y arma res.
 */
export class ClientsController extends BaseController {
  public constructor(
    private readonly service: ClientsService = new ClientsService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const clients = await this.service.getAll();
      res.status(200).json({ clients });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const client = await this.service.getOne(this.paramId(req));
      res.status(200).json({ client });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const client = await this.service.create(req.body as CreateClientDto);
      res.status(201).json({ client });
    });
  }

  // ================== UPDATE ==================
  // (rellenar en ISS-03-D) updatePut, updatePatch

  // ================== DELETE ==================
  // (rellenar en ISS-03-E) deletePhysical, deleteLogical
}
