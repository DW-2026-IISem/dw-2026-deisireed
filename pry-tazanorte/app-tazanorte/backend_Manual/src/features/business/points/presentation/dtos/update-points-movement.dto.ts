import { PartialType } from '@nestjs/mapped-types';
import { CreatePointsMovementDto } from './create-points-movement.dto';

export class UpdatePointsMovementDto extends PartialType(CreatePointsMovementDto) {}
