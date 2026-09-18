import { Injectable, Inject } from '@nestjs/common';
import { PointsMovement } from '../../domain/entities/points-movement.entity';
import { POINTS_MOVEMENT_REPOSITORY, IPointsMovementRepository } from '../../domain/interfaces/points-movement-repository.interface';

@Injectable()
export class GetPointsMovementsUseCase {
  constructor(
    @Inject(POINTS_MOVEMENT_REPOSITORY)
    private readonly pointsMovementRepository: IPointsMovementRepository,
  ) {}

  async execute(): Promise<PointsMovement[]> {
    return this.pointsMovementRepository.findAll();
  }
}
