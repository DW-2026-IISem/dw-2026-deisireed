import { Request, Response } from "express";
import { PaymentsService } from "./payments.service";

export class PaymentsController {
  private service: PaymentsService;

  constructor() {
    this.service = new PaymentsService();
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.service.getAll();
      res.json({ ok: true, data: payments });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error.message });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const payment = await this.service.getById(id);
      res.json({ ok: true, data: payment });
    } catch (error: any) {
      res.status(404).json({ ok: false, error: error.message });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const payment = await this.service.create(req.body);
      res.status(201).json({ ok: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const payment = await this.service.update(id, req.body);
      res.json({ ok: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.service.delete(id);
      res.json({ ok: true, message: "Pago eliminado correctamente" });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  }
}
