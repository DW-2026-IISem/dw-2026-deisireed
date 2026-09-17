import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../../../../../common/enums/status.enum';

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  clienteId: number;

  @ApiPropertyOptional({ example: 1 })
  origenId?: number;

  @ApiProperty({ example: 'CAJA' })
  canal: string;

  @ApiProperty()
  fecha: Date;

  @ApiProperty({ example: 15.5 })
  subtotal: number;

  @ApiProperty({ example: 15.5 })
  total: number;

  @ApiProperty({ example: 'PENDING' })
  estado: string;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
