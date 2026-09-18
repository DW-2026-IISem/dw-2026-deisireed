import { Module } from '@nestjs/common';
import { employeeRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-employee.repository';

@Module({
  providers: [employeeRepositoryProvider],
  exports: [employeeRepositoryProvider],
})
export class EmployeesModule {}
