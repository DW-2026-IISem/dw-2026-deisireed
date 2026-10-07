import { Request, Response } from 'express';
import { RoleUserService } from '../services/role-user.service';

export class RoleUserController {
  private service = new RoleUserService();

  async assign(req: Request, res: Response) {
    try { res.status(201).json({ success: true, data: await this.service.assignRole(req.body) }); }
    catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
  async remove(req: Request, res: Response) {
    try {
      await this.service.removeRole(req.body);
      res.json({ success: true, message: 'Rol removido del usuario.' });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
}
