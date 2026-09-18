import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreatePointsMovementUseCase } from '../../application/use-cases/create-points-movement.use-case';
import { GetPointsMovementsUseCase } from '../../application/use-cases/get-points-movements.use-case';
import { CreatePointsMovementDto } from '../dtos/create-points-movement.dto';

@Controller('points-movements')
export class PointsController {
  constructor(
    private readonly createPointsMovementUseCase: CreatePointsMovementUseCase,
    private readonly getPointsMovementsUseCase: GetPointsMovementsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreatePointsMovementDto) {
    return this.createPointsMovementUseCase.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getPointsMovementsUseCase.execute();
  }
}
