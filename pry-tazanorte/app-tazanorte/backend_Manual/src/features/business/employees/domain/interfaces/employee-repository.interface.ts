import { Employee } from '../entities/employee.entity';

export const EMPLOYEE_REPOSITORY = 'EMPLOYEE_REPOSITORY';

export interface IEmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findAll(): Promise<Employee[]>;
  findById(id: number): Promise<Employee | null>;
  update(id: number, data: Partial<Employee>): Promise<Employee>;
  delete(id: number): Promise<void>;
}
