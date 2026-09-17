import { Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model';
import { Sale } from '../../../domain/entities/sale.entity';
import {
  ISaleRepository,
  SaleFindAllParams,
} from '../../../domain/interfaces/sale-repository.interface';
import { SaleMapper } from '../../../application/mappers/sale.mapper';
import { SaleModel } from '../models/sale.model';
import { ProductSaleModel } from '../models/product-sale.model';

@Injectable()
export class SaleRepository implements ISaleRepository {
  async create(sale: Sale): Promise<Sale> {
    const sequelize = SaleModel.sequelize!;

    return sequelize.transaction(async (transaction) => {
      const saleModel = await SaleModel.create(
        SaleMapper.toPersistence(sale),
        { transaction },
      );

      const itemModels = await ProductSaleModel.bulkCreate(
        sale.items.map((item) => ({
          productId: item.productId,
          saleId: saleModel.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        { transaction },
      );

      for (const item of sale.items) {
        const product = await ProductModel.findByPk(item.productId, {
          transaction,
        });
        if (product) {
          await product.update(
            { quantity: product.quantity - item.quantity },
            { transaction },
          );
        }
      }

      return SaleMapper.toDomain(saleModel, itemModels);
    });
  }

  async update(sale: Sale): Promise<Sale> {
    await SaleModel.update(SaleMapper.toPersistence(sale), {
      where: { id: sale.id },
    });

    const updated = await SaleModel.findByPk(sale.id!, {
      include: [ProductSaleModel],
    });

    return SaleMapper.toDomain(updated!, updated!.items as ProductSaleModel[]);
  }

  async findById(id: number): Promise<Sale | null> {
    const model = await SaleModel.findByPk(id, {
      include: [ProductSaleModel],
    });

    if (!model) {
      return null;
    }

    return SaleMapper.toDomain(model, model.items as ProductSaleModel[]);
  }

  async findAll(params: SaleFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where = params.clientId ? { clientId: params.clientId } : {};

    const { rows, count } = await SaleModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [ProductSaleModel],
    });

    return buildPaginatedResult(
      rows.map((row) =>
        SaleMapper.toDomain(row, row.items as ProductSaleModel[]),
      ),
      count,
      page,
      limit,
    );
  }
}
