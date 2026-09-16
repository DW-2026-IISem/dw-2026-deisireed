import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../../domain/interfaces/product-repository.interface';
import { Product } from '../../../domain/entities/product.entity';
import { ProductModel } from '../models/product.model';
import { ProductMapper } from '../../../application/mappers/product.mapper';

@Injectable()
export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    const model = await ProductModel.create(ProductMapper.toPersistence(product));
    return ProductMapper.toDomain(model);
  }

  async findById(id: number): Promise<Product | null> {
    const model = await ProductModel.findByPk(id);
    return model ? ProductMapper.toDomain(model) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const model = await ProductModel.findOne({ where: { sku } });
    return model ? ProductMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Product[]> {
    const models = await ProductModel.findAll();
    return models.map(ProductMapper.toDomain);
  }
}
