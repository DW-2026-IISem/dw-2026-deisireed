import { Request, Response } from "express";
import { LoyaltyPoints } from "./loyalty-points.model";

export class LoyaltyPointsController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const records = await LoyaltyPoints.findAll();
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener puntos de fidelización", error });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const record = await LoyaltyPoints.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: "Registro de puntos no encontrado" });
      }
      return res.status(200).json(record);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el registro de puntos", error });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { clientId, points } = req.body;
      const newRecord = await LoyaltyPoints.create({ clientId, points });
      return res.status(201).json(newRecord);
    } catch (error) {
      return res.status(500).json({ message: "Error al registrar puntos de fidelización", error });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const { points } = req.body;
      const record = await LoyaltyPoints.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: "Registro de puntos no encontrado" });
      }
      await record.update({ points });
      return res.status(200).json(record);
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar puntos de fidelización", error });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const record = await LoyaltyPoints.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: "Registro de puntos no encontrado" });
      }
      await record.destroy();
      return res.status(200).json({ message: "Registro de puntos eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar puntos de fidelización", error });
    }
  }
}
