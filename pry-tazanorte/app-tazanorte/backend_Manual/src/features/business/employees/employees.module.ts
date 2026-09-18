import { Module } from '@nestjs/common';
import { EmployeesController } from './presentation/controllers/employees.controller';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { GetEmployeesUseCase } from './application/use-cases/get-employees.use-case';
import { employeeRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-employee.repository';

@Module({
  controllers: [EmployeesController],
  providers: [
    employeeRepositoryProvider,
    CreateEmployeeUseCase,
    GetEmployeesUseCase,
  ],
  exports: [employeeRepositoryProvider],
})
export class EmployeesModule {}
