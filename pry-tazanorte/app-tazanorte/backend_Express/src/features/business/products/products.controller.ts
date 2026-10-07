import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateProductDto, PatchProductDto, UpdateProductDto } from "./dto";
import { ProductsService } from "./products.service";

/**
 * Capa Controller del feature Products.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class ProductsController extends BaseController {
  public constructor(
    private readonly service: ProductsService = new ProductsService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const products = await this.service.getAll();
      res.status(200).json({ products });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const product = await this.service.getOne(this.paramId(req));
      res.status(200).json({ product });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const product = await this.service.create(req.body as CreateProductDto);
      res.status(201).json({ product });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const product = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateProductDto
      );
      res.status(200).json({ product });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const product = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchProductDto
      );
      res.status(200).json({ product });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Product permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const product = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Product deactivated (logical delete)", product });
    });
  }
}
