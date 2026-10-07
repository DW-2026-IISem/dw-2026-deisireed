import { Request, Response, NextFunction } from 'express';
import { ResourceModel } from '../database/models/resource.model';
import { RoleModel } from '../database/models/role.model';

export const authorizeResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.roles || req.user.roles.length === 0) {
      res.status(403).json({ success: false, message: 'Acceso denegado: Usuario sin roles asignados.' });
      return;
    }

    const currentMethod = req.method.toUpperCase();
    const currentPath = req.baseUrl + req.path;

    if (req.user.roles.includes('ADMIN')) {
      next();
      return;
    }

    const resource = await ResourceModel.findOne({
      where: { method: currentMethod, path: currentPath },
      include: [{ model: RoleModel, as: 'roles' }],
    });

    if (!resource) {
      next();
      return;
    }

    const allowedRoles = (resource as any).roles ? (resource as any).roles.map((r: any) => r.name) : [];
    const hasPermission = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      res.status(403).json({ success: false, message: 'Acceso denegado: No posee permisos para este recurso.' });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error en la verificación de permisos.', error: error.message });
  }
};
