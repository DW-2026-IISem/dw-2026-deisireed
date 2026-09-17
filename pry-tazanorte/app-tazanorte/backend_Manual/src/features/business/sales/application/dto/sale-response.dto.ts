import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../../../../common/enums/status.enum';

export class SaleItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 59999 })
  unitPrice: number;

  @ApiProperty({ example: 119998 })
  total: number;
}

export class SaleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty()
  saleDate: Date;

  @ApiProperty({ example: 119998 })
  subtotal: number;

  @ApiProperty({ example: 22799 })
  tax: number;

  @ApiProperty({ example: 0 })
  discounts: number;

  @ApiProperty({ example: 142797 })
  total: number;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status: Status;

  @ApiProperty({ example: 1 })
  clientId: number;

  @ApiProperty({ type: [SaleItemResponseDto] })
  items: SaleItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
