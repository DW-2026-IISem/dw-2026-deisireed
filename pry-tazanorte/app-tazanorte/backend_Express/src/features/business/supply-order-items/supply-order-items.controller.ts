import { Request, Response } from "express";
import { SupplyOrderItem } from "./supply-order-item.model";

export class SupplyOrderItemsController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const items = await SupplyOrderItem.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener insumos de items de pedido" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await SupplyOrderItem.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Error al registrar insumo en item de pedido" });
    }
  }
}
