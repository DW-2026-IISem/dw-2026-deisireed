import {
  CashRegisterResponseDto,
  CreateCashRegisterDto,
  PatchCashRegisterDto,
  UpdateCashRegisterDto,
  toCashRegisterResponse,
} from "./dto";
import { CashRegistersRepository } from "./cash-registers.repository";
import { EmployeesRepository } from "../employees/employees.repository";
import { CashRegister } from "./cash-register.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature CashRegisters.
 *
 * Reglas de negocio: default de `is_active`, el empleado referenciado debe
 * existir y estar activo, política de borrado lógico y borrado físico.
 *
 * Lee empleados a través de `EmployeesRepository` (no toca el modelo
 * directamente), así las capas se respetan entre features.
 */
export class CashRegistersService {
  public constructor(
    private readonly repository: CashRegistersRepository = new CashRegistersRepository(),
    private readonly employeesRepository: EmployeesRepository = new EmployeesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<CashRegisterResponseDto[]> {
    const cashRegisters = await this.repository.findAllActive();
    return cashRegisters.map((cashRegister) => toCashRegisterResponse(cashRegister));
  }

  public async getOne(id: number): Promise<CashRegisterResponseDto> {
    return toCashRegisterResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateCashRegisterDto): Promise<CashRegisterResponseDto> {
    await this.assertActiveEmployee(body.empleado_id);

    // Copia campo a campo a propósito (evita *mass assignment*).
    const cashRegister = await this.repository.create({
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      empleado_id: body.empleado_id,
      is_active: body.is_active ?? true,
    });
    return toCashRegisterResponse(cashRegister);
  }

  // ================== UPDATE ==================
  public async updatePut(
    id: number,
    body: UpdateCashRegisterDto
  ): Promise<CashRegisterResponseDto> {
    const cashRegister = await this.findOrFail(id);
    await this.assertActiveEmployee(body.empleado_id);

    await this.repository.update(cashRegister, {
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      empleado_id: body.empleado_id,
    });
    return toCashRegisterResponse(cashRegister);
  }

  public async updatePatch(
    id: number,
    body: PatchCashRegisterDto
  ): Promise<CashRegisterResponseDto> {
    const cashRegister = await this.findOrFail(id);

    if (body.empleado_id !== undefined) {
      await this.assertActiveEmployee(body.empleado_id);
    }

    // Solo campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(cashRegister, {
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
      ...(body.empleado_id !== undefined && { empleado_id: body.empleado_id }),
    });
    return toCashRegisterResponse(cashRegister);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const cashRegister = await this.findOrFail(id, false);
    await this.repository.delete(cashRegister);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<CashRegisterResponseDto> {
    const cashRegister = await this.findOrFail(id);

    await this.repository.update(cashRegister, { is_active: false });
    return toCashRegisterResponse(cashRegister);
  }

  // ================== HELPERS ==================
  /**
   * Busca por PK y falla con 404 si no existe.
   * `onlyActive` (por defecto `true`) aplica la política de borrado lógico.
   */
  private async findOrFail(id: number, onlyActive = true): Promise<CashRegister> {
    const cashRegister = await this.repository.findById(id);
    if (!cashRegister || (onlyActive && !cashRegister.is_active)) {
      throw new AppError(404, "Cash register not found");
    }
    return cashRegister;
  }

  /**
   * Regla: el empleado referenciado debe existir y estar activo.
   *
   * 400 si el valor no es un id válido o el empleado está inactivo; 404 si no
   * existe. El recurso de la URL sí existe, lo que falla es la **referencia**.
   */
  private async assertActiveEmployee(empleado_id: number): Promise<void> {
    if (!Number.isInteger(empleado_id) || empleado_id < 1) {
      throw new AppError(400, "empleado_id must be a positive integer");
    }
    const employee = await this.employeesRepository.findById(empleado_id);
    if (!employee) {
      throw new AppError(404, "Employee not found");
    }
    if (!employee.is_active) {
      throw new AppError(400, "Employee must be active");
    }
  }
}
