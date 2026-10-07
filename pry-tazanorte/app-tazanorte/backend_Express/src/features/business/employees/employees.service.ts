import {
  CreateEmployeeDto,
  EmployeeResponseDto,
  PatchEmployeeDto,
  UpdateEmployeeDto,
  toEmployeeResponse,
} from "./dto";
import { EmployeesRepository } from "./employees.repository";
import { Employee } from "./employee.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Employees.
 * Reglas de negocio: default de `is_active`, política de borrado lógico y
 * borrado físico. Devuelve **DTOs**, nunca instancias del modelo.
 */
export class EmployeesService {
  public constructor(
    private readonly repository: EmployeesRepository = new EmployeesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.repository.findAllActive();
    return employees.map((employee) => toEmployeeResponse(employee));
  }

  public async getOne(id: number): Promise<EmployeeResponseDto> {
    return toEmployeeResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    // Copia campo a campo a propósito (evita *mass assignment*).
    const employee = await this.repository.create({
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      is_active: body.is_active ?? true,
    });
    return toEmployeeResponse(employee);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.findOrFail(id);

    await this.repository.update(employee, {
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
    });
    return toEmployeeResponse(employee);
  }

  public async updatePatch(id: number, body: PatchEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.findOrFail(id);

    // Solo campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(employee, {
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
    });
    return toEmployeeResponse(employee);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const employee = await this.findOrFail(id, false);
    await this.repository.delete(employee);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<EmployeeResponseDto> {
    const employee = await this.findOrFail(id);

    await this.repository.update(employee, { is_active: false });
    return toEmployeeResponse(employee);
  }

  // ================== HELPERS ==================
  /**
   * Busca por PK y falla con 404 si no existe.
   * `onlyActive` (por defecto `true`) aplica la política de borrado lógico.
   */
  private async findOrFail(id: number, onlyActive = true): Promise<Employee> {
    const employee = await this.repository.findById(id);
    if (!employee || (onlyActive && !employee.is_active)) {
      throw new AppError(404, "Employee not found");
    }
    return employee;
  }
}
