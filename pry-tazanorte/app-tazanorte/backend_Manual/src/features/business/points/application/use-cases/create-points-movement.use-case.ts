import { Injectable, Inject } from '@nestjs/common';
import { PointsMovement } from '../../domain/entities/points-movement.entity';
import { POINTS_MOVEMENT_REPOSITORY, IPointsMovementRepository } from '../../domain/interfaces/points-movement-repository.interface';
import { CreatePointsMovementDto } from '../../presentation/dtos/create-points-movement.dto';

@Injectable()
export class CreatePointsMovementUseCase {
  constructor(
    @Inject(POINTS_MOVEMENT_REPOSITORY)
    private readonly pointsMovementRepository: IPointsMovementRepository,
  ) {}

  async execute(dto: CreatePointsMovementDto): Promise<PointsMovement> {
    const movement = new PointsMovement(dto);
    return this.pointsMovementRepository.create(movement);
  }
}
