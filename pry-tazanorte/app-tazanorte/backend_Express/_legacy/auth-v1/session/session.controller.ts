import { Request, Response } from "express";
import { SessionService } from "./session.service";
import { AppError } from "../../../shared/errors/app-error";


const service = new SessionService();

function sendFailure(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  console.error("Error en sesión:", error);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor."
  });
}

export class SessionController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body ?? {};

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
      ) {
        res.status(400).json({
          success: false,
          message: "Debes enviar email y password."
        });
        return;
      }

      const result = await service.login(
        { email, password },
        req.get("user-agent")?.slice(0, 500)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      sendFailure(res, error);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body ?? {};

      if (typeof refresh_token !== "string" || !refresh_token) {
        res.status(400).json({
          success: false,
          message: "Debes enviar refresh_token."
        });
        return;
      }

      const result = await service.refresh(refresh_token);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      sendFailure(res, error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body ?? {};

      if (typeof refresh_token !== "string" || !refresh_token) {
        res.status(400).json({
          success: false,
          message: "Debes enviar refresh_token."
        });
        return;
      }

      await service.logout(refresh_token);

      res.status(200).json({
        success: true,
        message: "Sesión cerrada correctamente."
      });
    } catch (error) {
      sendFailure(res, error);
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Debes autenticarte primero."
        });
        return;
      }

      if (!req.user?.id) {
  res.status(401).json({
    success: false,
    message: "Usuario no autenticado.",
  });
  return;
}

const profile = await service.profile(req.user.id);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      sendFailure(res, error);
    }
  }
}
