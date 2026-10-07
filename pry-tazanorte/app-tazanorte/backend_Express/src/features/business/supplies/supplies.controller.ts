import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateSupplyDto, PatchSupplyDto, UpdateSupplyDto } from "./dto";
import { SuppliesService } from "./supplies.service";

/**
 * Capa Controller del feature Supplies.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class SuppliesController extends BaseController {
  public constructor(
    private readonly service: SuppliesService = new SuppliesService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supplies = await this.service.getAll();
      res.status(200).json({ supplies });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply = await this.service.getOne(this.paramId(req));
      res.status(200).json({ supply });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply = await this.service.create(req.body as CreateSupplyDto);
      res.status(201).json({ supply });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateSupplyDto
      );
      res.status(200).json({ supply });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchSupplyDto
      );
      res.status(200).json({ supply });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Supply permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Supply deactivated (logical delete)", supply });
    });
  }
}
