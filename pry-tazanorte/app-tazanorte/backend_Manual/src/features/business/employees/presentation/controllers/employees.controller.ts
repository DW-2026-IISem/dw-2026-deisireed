import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case';
import { GetEmployeesUseCase } from '../../application/use-cases/get-employees.use-case';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly getEmployeesUseCase: GetEmployeesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    return this.createEmployeeUseCase.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getEmployeesUseCase.execute();
  }
}
