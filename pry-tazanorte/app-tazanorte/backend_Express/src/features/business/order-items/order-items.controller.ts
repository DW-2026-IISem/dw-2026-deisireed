import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateOrderItemDto, PatchOrderItemDto, UpdateOrderItemDto } from "./dto";
import { OrderItemsService } from "./order-items.service";

/**
 * Capa Controller del feature OrderItems.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class OrderItemsController extends BaseController {
  public constructor(private readonly service: OrderItemsService = new OrderItemsService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order_items = await this.service.getAll();
      res.status(200).json({ order_items });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order_item = await this.service.getOne(this.paramId(req));
      res.status(200).json({ order_item });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order_item = await this.service.create(req.body as CreateOrderItemDto);
      res.status(201).json({ order_item });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order_item = await this.service.updatePut(this.paramId(req), req.body as UpdateOrderItemDto);
      res.status(200).json({ order_item });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order_item = await this.service.updatePatch(this.paramId(req), req.body as PatchOrderItemDto);
      res.status(200).json({ order_item });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Order item permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order_item = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Order item deactivated (logical delete)", order_item });
    });
  }
}
