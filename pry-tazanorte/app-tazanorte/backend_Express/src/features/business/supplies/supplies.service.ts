import {
  CreateSupplyDto,
  PatchSupplyDto,
  SupplyResponseDto,
  UpdateSupplyDto,
  toSupplyResponse,
} from "./dto";
import { SuppliesRepository } from "./supplies.repository";
import { Supply } from "./supply.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Supplies.
 * Reglas de negocio: default de `is_active` y `stock_minimo`, código único,
 * política de borrado lógico y borrado físico. Devuelve **DTOs**.
 */
export class SuppliesService {
  public constructor(
    private readonly repository: SuppliesRepository = new SuppliesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<SupplyResponseDto[]> {
    const supplies = await this.repository.findAllActive();
    return supplies.map((supply) => toSupplyResponse(supply));
  }

  public async getOne(id: number): Promise<SupplyResponseDto> {
    return toSupplyResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateSupplyDto): Promise<SupplyResponseDto> {
    await this.assertUniqueCodigo(body.codigo);

    // Copia campo a campo a propósito (evita *mass assignment*).
    const supply = await this.repository.create({
      codigo: body.codigo,
      nombre: body.nombre,
      unidad_medida: body.unidad_medida,
      stock_minimo: body.stock_minimo ?? 0,
      is_active: body.is_active ?? true,
    });
    return toSupplyResponse(supply);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateSupplyDto): Promise<SupplyResponseDto> {
    const supply = await this.findOrFail(id);
    await this.assertUniqueCodigo(body.codigo, id);

    await this.repository.update(supply, {
      codigo: body.codigo,
      nombre: body.nombre,
      unidad_medida: body.unidad_medida,
      stock_minimo: body.stock_minimo,
    });
    return toSupplyResponse(supply);
  }

  public async updatePatch(id: number, body: PatchSupplyDto): Promise<SupplyResponseDto> {
    const supply = await this.findOrFail(id);

    if (body.codigo !== undefined) {
      await this.assertUniqueCodigo(body.codigo, id);
    }

    // Solo campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(supply, {
      ...(body.codigo !== undefined && { codigo: body.codigo }),
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.unidad_medida !== undefined && { unidad_medida: body.unidad_medida }),
      ...(body.stock_minimo !== undefined && { stock_minimo: body.stock_minimo }),
    });
    return toSupplyResponse(supply);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const supply = await this.findOrFail(id, false);
    await this.repository.delete(supply);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<SupplyResponseDto> {
    const supply = await this.findOrFail(id);

    await this.repository.update(supply, { is_active: false });
    return toSupplyResponse(supply);
  }

  // ================== HELPERS ==================
  /**
   * Busca por PK y falla con 404 si no existe.
   * `onlyActive` (por defecto `true`) aplica la política de borrado lógico.
   */
  private async findOrFail(id: number, onlyActive = true): Promise<Supply> {
    const supply = await this.repository.findById(id);
    if (!supply || (onlyActive && !supply.is_active)) {
      throw new AppError(404, "Supply not found");
    }
    return supply;
  }

  /** Regla: no puede haber dos insumos con el mismo `codigo`. */
  private async assertUniqueCodigo(codigo: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByCodigo(codigo, excludeId);
    if (existing) {
      throw new AppError(409, "A supply with this codigo already exists");
    }
  }
}
