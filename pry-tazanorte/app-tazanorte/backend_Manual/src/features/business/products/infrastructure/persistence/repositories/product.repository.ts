import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { PaginatedResult } from '../../../../../../common/interfaces/pagination.interface';
import { Product } from '../../../domain/entities/product.entity';
import { IProductRepository, ProductFindAllParams } from '../../../domain/interfaces/product-repository.interface';
import { ProductMapper } from '../../../application/mappers/product.mapper';
import { ProductModel } from '../models/product.model';

@Injectable()
export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    const model = await ProductModel.create(ProductMapper.toPersistence(product));
    return ProductMapper.toDomain(model);
  }

  async update(product: Product): Promise<Product> {
    await ProductModel.update(ProductMapper.toPersistence(product), { where: { id: product.id } });
    const updated = await ProductModel.findByPk(product.id!);
    return ProductMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Product | null> {
    const model = await ProductModel.findByPk(id);
    return model ? ProductMapper.toDomain(model) : null;
  }

  async findAll(params: ProductFindAllParams): Promise<PaginatedResult<Product>> {
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const limit = Number(params.limit) > 0 ? Number(params.limit) : 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};
    if (params.nombre) where.nombre = { [Op.like]: `%${params.nombre}%` };

    const { rows, count } = await ProductModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      items: rows.map((row) => ProductMapper.toDomain(row)),
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}
