import { Request, Response } from 'express';
import { ResourceRoleService } from '../services/resource-role.service';

export class ResourceRoleController {
  private service = new ResourceRoleService();

  async assign(req: Request, res: Response) {
    try { res.status(201).json({ success: true, data: await this.service.assignResource(req.body) }); }
    catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
  async remove(req: Request, res: Response) {
    try {
      await this.service.removeResource(req.body);
      res.json({ success: true, message: 'Recurso removido del rol.' });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  }
}
