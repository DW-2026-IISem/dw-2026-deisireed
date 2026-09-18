import { Module } from '@nestjs/common';
import { pointsMovementRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-points-movement.repository';

@Module({
  providers: [pointsMovementRepositoryProvider],
  exports: [pointsMovementRepositoryProvider],
})
export class PointsModule {}
