import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  clienteId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  origenId?: number;

  @ApiProperty({ example: 'CAJA' })
  @IsString()
  @IsNotEmpty()
  canal: string;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiPropertyOptional({ example: 'PENDING', default: 'PENDING' })
  @IsOptional()
  @IsString()
  estado?: string;
}
