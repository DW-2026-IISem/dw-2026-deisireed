import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'CAF-001' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Café Americano 12oz' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Café de grano selecto' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  precio: number;
}
