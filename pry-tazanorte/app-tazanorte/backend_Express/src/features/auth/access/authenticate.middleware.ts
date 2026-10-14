import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../../shared/auth/jwt";
import { UserModel } from "../../../shared/database/models/user.model";
import { RoleModel } from "../../../shared/database/models/role.model";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Se requiere un token Bearer.",
    });
    return;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "El token está vacío.",
    });
    return;
  }

  try {
    const payload = JwtService.verifyToken(token);

    if (
      !payload ||
      typeof payload !== "object" ||
      typeof payload.sub !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "El token no contiene un identificador de usuario válido.",
      });
      return;
    }

    const user = await UserModel.findByPk(payload.sub, {
      attributes: ["id", "email", "is_active"],
      include: [
        {
          model: RoleModel,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: "El usuario no existe o está inactivo.",
      });
      return;
    }

    req.user = {
      sub: user.id,
      id: user.id,
      email: user.email,
      roles: (user.roles ?? []).map((role) => role.name),
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "El token es inválido o ha expirado.",
    });
  }
}
