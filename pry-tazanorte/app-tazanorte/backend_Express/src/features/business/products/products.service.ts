import {
  CreateProductDto,
  PatchProductDto,
  ProductResponseDto,
  UpdateProductDto,
  toProductResponse,
} from "./dto";
import { ProductsRepository } from "./products.repository";
import { Product } from "./product.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Products.
 * Reglas de negocio: default de `is_active`, SKU único, política de borrado
 * lógico y borrado físico. Devuelve **DTOs**, nunca instancias del modelo.
 */
export class ProductsService {
  public constructor(
    private readonly repository: ProductsRepository = new ProductsRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ProductResponseDto[]> {
    const products = await this.repository.findAllActive();
    return products.map((product) => toProductResponse(product));
  }

  public async getOne(id: number): Promise<ProductResponseDto> {
    return toProductResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateProductDto): Promise<ProductResponseDto> {
    await this.assertUniqueSku(body.sku);

    // Copia campo a campo a propósito (evita *mass assignment*).
    const product = await this.repository.create({
      sku: body.sku,
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      precio: body.precio,
      is_active: body.is_active ?? true,
    });
    return toProductResponse(product);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.findOrFail(id);
    await this.assertUniqueSku(body.sku, id);

    await this.repository.update(product, {
      sku: body.sku,
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      precio: body.precio,
    });
    return toProductResponse(product);
  }

  public async updatePatch(id: number, body: PatchProductDto): Promise<ProductResponseDto> {
    const product = await this.findOrFail(id);

    if (body.sku !== undefined) {
      await this.assertUniqueSku(body.sku, id);
    }

    // Solo campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(product, {
      ...(body.sku !== undefined && { sku: body.sku }),
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
      ...(body.precio !== undefined && { precio: body.precio }),
    });
    return toProductResponse(product);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const product = await this.findOrFail(id, false);
    await this.repository.delete(product);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<ProductResponseDto> {
    const product = await this.findOrFail(id);

    await this.repository.update(product, { is_active: false });
    return toProductResponse(product);
  }

  // ================== HELPERS ==================
  /**
   * Busca por PK y falla con 404 si no existe.
   * `onlyActive` (por defecto `true`) aplica la política de borrado lógico:
   * un registro inactivo deja de ser visible para la API.
   */
  private async findOrFail(id: number, onlyActive = true): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product || (onlyActive && !product.is_active)) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  /** Regla: no puede haber dos productos con el mismo `sku`. */
  private async assertUniqueSku(sku: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findBySku(sku, excludeId);
    if (existing) {
      throw new AppError(409, "A product with this sku already exists");
    }
  }
}
