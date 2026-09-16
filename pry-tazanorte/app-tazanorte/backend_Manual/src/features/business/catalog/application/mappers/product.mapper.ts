import { Product } from '../../domain/entities/product.entity';
import { ProductModel } from '../../infrastructure/persistence/models/product.model';

export class ProductMapper {
  static toDomain(model: ProductModel): Product {
    return Product.reconstitute({
      id: model.id,
      sku: model.sku,
      name: model.name,
      description: model.description,
      price: Number(model.price),
      isActive: model.isActive,
    });
  }

  static toPersistence(entity: Product): Partial<ProductModel> {
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      isActive: entity.isActive,
    };
  }
}
