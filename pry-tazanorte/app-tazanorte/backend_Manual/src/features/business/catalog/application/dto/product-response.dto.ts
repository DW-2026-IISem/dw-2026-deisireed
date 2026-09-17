import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Café Espresso' })
  name: string;

  @ApiProperty({ example: 2.50 })
  price: number;

  @ApiProperty({ example: '2026-09-16T18:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-16T18:00:00.000Z' })
  updatedAt: Date;
}
