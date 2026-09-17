import { Injectable } from '@nestjs/common';
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
          const currentStock = (product as any).stock ?? (product as any).quantity ?? 0;
          const updatedValue = currentStock - item.quantity;
          const updateData = (product as any).stock !== undefined 
            ? { stock: updatedValue } 
            : { quantity: updatedValue };

          await product.update(updateData, { transaction });
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
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const limit = params.limit && params.limit > 0 ? Number(params.limit) : 10;
    const offset = (page - 1) * limit;

    const where = params.clientId ? { clientId: params.clientId } : {};

    const { rows, count } = await SaleModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [ProductSaleModel],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      items: rows.map((row) =>
        SaleMapper.toDomain(row, row.items as ProductSaleModel[]),
      ),
      meta: {
        totalItems: count,
        itemCount: rows.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        page,
        limit,
        total: count,
      },
    };
  }
}
