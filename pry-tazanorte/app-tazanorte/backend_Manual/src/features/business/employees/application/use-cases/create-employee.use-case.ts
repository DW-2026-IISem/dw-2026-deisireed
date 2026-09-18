import { Injectable, Inject } from '@nestjs/common';
import { Employee } from '../../domain/entities/employee.entity';
import { EMPLOYEE_REPOSITORY, IEmployeeRepository } from '../../domain/interfaces/employee-repository.interface';
import { CreateEmployeeDto } from '../../presentation/dtos/create-employee.dto';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = new Employee(dto);
    return this.employeeRepository.create(employee);
  }
}
