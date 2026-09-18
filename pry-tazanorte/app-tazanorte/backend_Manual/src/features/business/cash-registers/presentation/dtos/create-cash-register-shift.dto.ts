import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../../../../../common/enums/status.enum';

export class CreateCashRegisterShiftDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(Status)
  @IsOptional()
  isActive?: Status;
}
