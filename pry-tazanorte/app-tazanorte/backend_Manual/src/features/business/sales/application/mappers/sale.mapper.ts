import { Status } from '../../../../../common/enums/status.enum';
import { Sale, SaleItem } from '../../domain/entities/sale.entity';
import {
  SaleItemResponseDto,
  SaleResponseDto,
} from '../dto/sale-response.dto';
import { SaleModel } from '../../infrastructure/persistence/models/sale.model';
import { ProductSaleModel } from '../../infrastructure/persistence/models/product-sale.model';

export class SaleMapper {
  static toDomain(saleModel: SaleModel, itemModels: ProductSaleModel[]): Sale {
    const items = itemModels.map((item) =>
      SaleItem.reconstitute({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
        saleId: item.saleId,
      }),
    );

    return Sale.reconstitute({
      id: saleModel.id,
      saleDate: saleModel.saleDate,
      subtotal: Number(saleModel.subtotal),
      tax: Number(saleModel.tax),
      discounts: Number(saleModel.discounts),
      total: Number(saleModel.total),
      status: saleModel.status,
      clientId: saleModel.clientId,
      items,
      createdAt: saleModel.createdAt,
      updatedAt: saleModel.updatedAt,
    });
  }

  static toResponse(entity: Sale): SaleResponseDto {
    return {
      id: entity.id!,
      saleDate: entity.saleDate,
      subtotal: entity.subtotal,
      tax: entity.tax,
      discounts: entity.discounts,
      total: entity.total,
      status: entity.status,
      clientId: entity.clientId,
      items: entity.items.map((item) => SaleMapper.toItemResponse(item)),
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toItemResponse(item: SaleItem): SaleItemResponseDto {
    return {
      id: item.id!,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    };
  }

  static toPersistence(entity: Sale): Partial<SaleModel> {
    return {
      id: entity.id,
      saleDate: entity.saleDate,
      subtotal: entity.subtotal,
      tax: entity.tax,
      discounts: entity.discounts,
      total: entity.total,
      status: entity.status ?? Status.ACTIVE,
      clientId: entity.clientId,
    };
  }
}
