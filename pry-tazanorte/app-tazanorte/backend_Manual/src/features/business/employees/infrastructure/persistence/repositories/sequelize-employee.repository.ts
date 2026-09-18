import { Injectable } from '@nestjs/common';
import { Employee } from '../../../domain/entities/employee.entity';
import { EMPLOYEE_REPOSITORY, IEmployeeRepository } from '../../../domain/interfaces/employee-repository.interface';
import { EmployeeModel } from '../models/employee.model';

@Injectable()
export class SequelizeEmployeeRepository implements IEmployeeRepository {
  async create(employee: Employee): Promise<Employee> {
    const model = await EmployeeModel.create({
      nombre: employee.nombre,
      descripcion: employee.descripcion,
      is_active: employee.isActive,
    });
    return new Employee({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion ?? undefined,
      isActive: model.is_active,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  async findAll(): Promise<Employee[]> {
    const models = await EmployeeModel.findAll({ order: [['id', 'ASC']] });
    return models.map(m => new Employee({
      id: m.id,
      nombre: m.nombre,
      descripcion: m.descripcion ?? undefined,
      isActive: m.is_active,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));
  }

  async findById(id: number): Promise<Employee | null> {
    const model = await EmployeeModel.findByPk(id);
    if (!model) return null;
    return new Employee({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion ?? undefined,
      isActive: model.is_active,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const model = await EmployeeModel.findByPk(id);
    if (!model) throw new Error(`Empleado ${id} no encontrado`);
    await model.update({
      nombre: data.nombre,
      descripcion: data.descripcion,
      is_active: data.isActive,
    });
    return this.findById(id) as Promise<Employee>;
  }

  async delete(id: number): Promise<void> {
    await EmployeeModel.destroy({ where: { id } });
  }
}

export const employeeRepositoryProvider = {
  provide: EMPLOYEE_REPOSITORY,
  useClass: SequelizeEmployeeRepository,
};
