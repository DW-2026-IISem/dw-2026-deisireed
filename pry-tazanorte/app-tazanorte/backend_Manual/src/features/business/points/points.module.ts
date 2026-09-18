import { Module } from '@nestjs/common';
import { PointsController } from './presentation/controllers/points.controller';
import { CreatePointsMovementUseCase } from './application/use-cases/create-points-movement.use-case';
import { GetPointsMovementsUseCase } from './application/use-cases/get-points-movements.use-case';
import { pointsMovementRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-points-movement.repository';

@Module({
  controllers: [PointsController],
  providers: [
    pointsMovementRepositoryProvider,
    CreatePointsMovementUseCase,
    GetPointsMovementsUseCase,
  ],
  exports: [pointsMovementRepositoryProvider],
})
export class PointsModule {}
