import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { UserModel } from "../../../shared/database/models/user.model";
import { RoleModel } from "../../../shared/database/models/role.model";
import { ResourceModel } from "../../../shared/database/models/resource.model";
import { ResourceRoleModel } from "../../../shared/database/models/resource-role.model";
import { pathMatches, normalizePath } from "../../../shared/auth/resource-match";

export async function authorizeResource(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Debes autenticarte primero."
      });
      return;
    }

    const user = await UserModel.findByPk(req.user.id, {
      include: [
        {
          model: RoleModel,
          attributes: ["id", "name"],
          through: { attributes: [] }
        }
      ]
    });

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: "Usuario inexistente o inactivo."
      });
      return;
    }

    const roles = user.roles ?? [];

    if (roles.length === 0) {
      res.status(403).json({
        success: false,
        message: "El usuario no tiene roles asignados."
      });
      return;
    }

    const roleIds = roles.map((role) => role.id);

    const grants = await ResourceRoleModel.findAll({
      where: {
        role_id: { [Op.in]: roleIds }
      },
      attributes: ["resource_id"]
    });

    const resourceIds = [...new Set(grants.map((grant) => grant.resource_id))];

    if (resourceIds.length === 0) {
      res.status(403).json({
        success: false,
        message: "No existen permisos asignados a los roles del usuario."
      });
      return;
    }

    const resources = await ResourceModel.findAll({
      where: {
        id: { [Op.in]: resourceIds },
        method: req.method.toUpperCase()
      },
      attributes: ["id", "method", "path"]
    });

    const requestPath = normalizePath(`${req.baseUrl}${req.path}`);

    const permitted = resources.some((resource) =>
      pathMatches(resource.path, requestPath)
    );

    if (!permitted) {
      res.status(403).json({
        success: false,
        message: "Acceso denegado: no existe un permiso explícito para este recurso."
      });
      return;
    }

    req.user.roles = roles.map((role) => role.name);
    next();
  } catch (error) {
    next(error);
  }
}
