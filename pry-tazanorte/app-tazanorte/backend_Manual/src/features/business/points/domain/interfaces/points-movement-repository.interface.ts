import { PointsMovement } from '../entities/points-movement.entity';

export const POINTS_MOVEMENT_REPOSITORY = 'POINTS_MOVEMENT_REPOSITORY';

export interface IPointsMovementRepository {
  create(movement: PointsMovement): Promise<PointsMovement>;
  findAll(): Promise<PointsMovement[]>;
  findById(id: number): Promise<PointsMovement | null>;
  update(id: number, data: Partial<PointsMovement>): Promise<PointsMovement>;
  delete(id: number): Promise<void>;
}
