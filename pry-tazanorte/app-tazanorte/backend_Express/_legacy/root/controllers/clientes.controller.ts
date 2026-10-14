import { Request, Response } from 'express';
import { clientesService } from '../services/clientes.service';

export const clientesController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const clientes = await clientesService.getAll();
      res.json({
        success: true,
        message: 'Lista de clientes cargada correctamente',
        data: clientes
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener clientes', error });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      res.json({ success: true, message: `Obtener cliente con ID: ${id}`, data: null });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor', error });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      res.status(201).json({ success: true, message: 'Cliente creado exitosamente', data: req.body });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear cliente', error });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      res.json({ success: true, message: `Cliente con ID ${id} actualizado`, data: req.body });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar cliente', error });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      res.json({ success: true, message: `Cliente con ID ${id} eliminado` });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar cliente', error });
    }
  },
};
