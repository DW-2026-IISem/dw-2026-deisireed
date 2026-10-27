import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateSupplyOrderItemDto, PatchSupplyOrderItemDto, UpdateSupplyOrderItemDto } from "./dto";
import { SupplyOrderItemsService } from "./supply-order-items.service";

/**
 * Capa Controller del feature SupplyOrderItems.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class SupplyOrderItemsController extends BaseController {
  public constructor(
    private readonly service: SupplyOrderItemsService = new SupplyOrderItemsService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply_order_items = await this.service.getAll();
      res.status(200).json({ supply_order_items });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply_order_item = await this.service.getOne(this.paramId(req));
      res.status(200).json({ supply_order_item });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply_order_item = await this.service.create(req.body as CreateSupplyOrderItemDto);
      res.status(201).json({ supply_order_item });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply_order_item = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateSupplyOrderItemDto
      );
      res.status(200).json({ supply_order_item });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply_order_item = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchSupplyOrderItemDto
      );
      res.status(200).json({ supply_order_item });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Supply order item permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const supply_order_item = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Supply order item deactivated (logical delete)", supply_order_item });
    });
  }
}
