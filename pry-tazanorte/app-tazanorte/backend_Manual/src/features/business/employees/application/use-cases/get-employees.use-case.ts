import { Injectable, Inject } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';
import { EMPLOYEE_REPOSITORY, IEmployeeRepository } from '../../domain/interfaces/employee-repository.interface';

@Injectable()
export class GetEmployeesUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }
}
