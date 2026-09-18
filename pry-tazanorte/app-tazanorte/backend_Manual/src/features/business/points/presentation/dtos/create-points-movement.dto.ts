import { IsNumber, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../../../../../common/enums/status.enum';

export class CreatePointsMovementDto {
  @IsNumber()
  @IsNotEmpty()
  referenciaId: number;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsEnum(Status)
  @IsOptional()
  estado?: Status;
}
