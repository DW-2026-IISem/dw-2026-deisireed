import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Product } from '../../../domain/entities/product.entity';
import {
  IProductRepository,
  PaginatedProducts,
} from '../../../domain/interfaces/product-repository.interface';
import { ProductFilterDto } from '../../../application/dto/product-filter.dto';
import { ProductMapper } from '../../../application/mappers/product.mapper';
import { ProductModel } from '../models/product.model';

@Injectable()
export class ProductRepository implements IProductRepository {
  async findById(id: number): Promise<Product | null> {
    const model = await ProductModel.findByPk(id);
    return model ? ProductMapper.toDomain(model) : null;
  }

  async findAll(filter: ProductFilterDto): Promise<PaginatedProducts> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (filter.search) {
      where.name = { [Op.like]: `%${filter.search}%` };
    }

    const { count, rows } = await ProductModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      items: rows.map((model) => ProductMapper.toDomain(model)),
      meta: {
        totalItems: count,
        itemCount: rows.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    };
  }

  async save(product: Product): Promise<Product> {
    const data = ProductMapper.toPersistence(product);
    const model = await ProductModel.create(data as any);
    return ProductMapper.toDomain(model);
  }

  async update(product: Product): Promise<Product> {
    const data = ProductMapper.toPersistence(product);
    await ProductModel.update(data, { where: { id: product.id } });
    const updatedModel = await ProductModel.findByPk(product.id);
    return ProductMapper.toDomain(updatedModel!);
  }

  async delete(id: number): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }
}
