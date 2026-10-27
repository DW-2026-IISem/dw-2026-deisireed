import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateLoyaltyPointDto, PatchLoyaltyPointDto, UpdateLoyaltyPointDto } from "./dto";
import { LoyaltyPointsService } from "./loyalty-points.service";

/**
 * Capa Controller del feature LoyaltyPoints.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class LoyaltyPointsController extends BaseController {
  public constructor(
    private readonly service: LoyaltyPointsService = new LoyaltyPointsService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const loyalty_points = await this.service.getAll();
      res.status(200).json({ loyalty_points });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const loyalty_point = await this.service.getOne(this.paramId(req));
      res.status(200).json({ loyalty_point });
    });
  }

  /** Saldo de puntos de un cliente (`:id` = id del cliente). */
  public async getBalance(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const balance = await this.service.getBalance(this.paramId(req));
      res.status(200).json({ balance });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const loyalty_point = await this.service.create(req.body as CreateLoyaltyPointDto);
      res.status(201).json({ loyalty_point });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const loyalty_point = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateLoyaltyPointDto
      );
      res.status(200).json({ loyalty_point });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const loyalty_point = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchLoyaltyPointDto
      );
      res.status(200).json({ loyalty_point });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Loyalty movement permanently deleted", id });
    });
  }

  /** Eliminación lógica = anular el movimiento (`is_active = false`). */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const loyalty_point = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Loyalty movement annulled (logical delete)", loyalty_point });
    });
  }
}
