import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import {
  CreateOrderDto,
  PatchOrderDto,
  UpdateOrderDto,
  UpdateOrderStateDto,
} from "./dto";
import { OrdersService } from "./orders.service";

/**
 * Capa Controller del feature Orders.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class OrdersController extends BaseController {
  public constructor(private readonly service: OrdersService = new OrdersService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const orders = await this.service.getAll();
      res.status(200).json({ orders });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order = await this.service.getOne(this.paramId(req));
      res.status(200).json({ order });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const result = await this.service.create(req.body as CreateOrderDto);
      res.status(201).json(result);
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order = await this.service.updatePut(this.paramId(req), req.body as UpdateOrderDto);
      res.status(200).json({ order });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order = await this.service.updatePatch(this.paramId(req), req.body as PatchOrderDto);
      res.status(200).json({ order });
    });
  }

  /** Cambio de estado (`PATCH /api/pedidos/:id/estado`). */
  public async updateState(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order = await this.service.updateState(this.paramId(req), req.body as UpdateOrderStateDto);
      res.status(200).json({ order });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física (sólo pedidos pendiente o cancelado). */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Order permanently deleted", id });
    });
  }

  /** Eliminación lógica = cancelación (`estado = cancelado`). */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const order = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Order cancelled (logical delete)", order });
    });
  }
}
