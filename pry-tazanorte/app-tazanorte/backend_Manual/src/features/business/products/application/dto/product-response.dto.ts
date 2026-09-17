import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'CAF-001' })
  sku: string;

  @ApiProperty({ example: 'Café Americano 12oz' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Café de grano selecto' })
  descripcion?: string;

  @ApiProperty({ example: 4.5 })
  precio: number;

  @ApiProperty({ example: true })
  isActive: boolean;
}
