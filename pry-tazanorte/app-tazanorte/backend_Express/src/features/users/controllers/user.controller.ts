import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private service = new UserService();
  private getId = (req: Request) => Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  async create(req: Request, res: Response) {
    try { res.status(201).json({ success: true, data: await this.service.create(req.body) }); }
    catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
  async findAll(_req: Request, res: Response) {
    try { res.json({ success: true, data: await this.service.findAll() }); }
    catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }
  async findById(req: Request, res: Response) {
    try { res.json({ success: true, data: await this.service.findById(this.getId(req)) }); }
    catch (e: any) { res.status(404).json({ success: false, message: e.message }); }
  }
  async update(req: Request, res: Response) {
    try { res.json({ success: true, data: await this.service.update(this.getId(req), req.body) }); }
    catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
  async changePassword(req: Request, res: Response) {
    try {
      await this.service.changePassword((req as any).user?.sub || this.getId(req), req.body);
      res.json({ success: true, message: 'Contraseña actualizada.' });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
  async getPermissions(req: Request, res: Response) {
    try { res.json({ success: true, data: await this.service.getEffectivePermissions(this.getId(req) || (req as any).user?.sub) }); }
    catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }
}
