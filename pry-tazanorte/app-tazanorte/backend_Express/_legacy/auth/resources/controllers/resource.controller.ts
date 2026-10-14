import { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service';

export class ResourceController {
  private service = new ResourceService();
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
}
