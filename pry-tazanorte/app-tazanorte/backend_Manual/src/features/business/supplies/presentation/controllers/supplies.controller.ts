import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateSupplyUseCase } from '../../application/use-cases/create-supply.use-case';
import { GetSuppliesUseCase } from '../../application/use-cases/get-supplies.use-case';
import { CreateSupplyDto } from '../dtos/create-supply.dto';

@Controller('supplies')
export class SuppliesController {
  constructor(
    private readonly createSupplyUseCase: CreateSupplyUseCase,
    private readonly getSuppliesUseCase: GetSuppliesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateSupplyDto) {
    return this.createSupplyUseCase.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getSuppliesUseCase.execute();
  }
}
