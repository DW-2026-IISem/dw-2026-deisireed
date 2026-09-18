import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../../../../../common/enums/status.enum';

export class CreateSupplyDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  unidadMedida: string;

  @IsNumber()
  @IsNotEmpty()
  stockActual: number;

  @IsNumber()
  @IsOptional()
  stockMinimo?: number;

  @IsNumber()
  @IsOptional()
  costoUnitario?: number;

  @IsEnum(Status)
  @IsOptional()
  isActive?: Status;
}
