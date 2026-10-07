import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private service = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const result = await this.service.login(req.body);
      res.json({ success: true, data: result });
    } catch (e: any) {
      res.status(401).json({ success: false, message: e.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const result = await this.service.refresh(req.body);
      res.json({ success: true, data: result });
    } catch (e: any) {
      res.status(401).json({ success: false, message: e.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.body.refresh_token;
      if (token) await this.service.logout(token);
      res.json({ success: true, message: 'Sesión cerrada correctamente.' });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}
