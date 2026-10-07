import { CreationAttributes, Transaction } from "sequelize";
import { Employee, EmployeeI } from "./employee.model";

/**
 * Capa Repository del feature Employees.
 * Única responsable de hablar con Sequelize (el modelo `Employee`).
 */
export class EmployeesRepository {
  // ================== READ ==================
  /** Todos los empleados activos. */
  public async findAllActive(): Promise<Employee[]> {
    return Employee.findAll({ where: { is_active: true } });
  }

  /** Un empleado por PK (o `null`). Acepta transacción para flujos de turnos. */
  public async findById(id: number, transaction?: Transaction): Promise<Employee | null> {
    return Employee.findByPk(id, { transaction });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<Employee>): Promise<Employee> {
    return Employee.create(data);
  }

  // ================== UPDATE ==================
  public async update(employee: Employee, data: Partial<EmployeeI>): Promise<Employee> {
    return employee.update(data);
  }

  // ================== DELETE ==================
  public async delete(employee: Employee): Promise<void> {
    await employee.destroy();
  }
}
