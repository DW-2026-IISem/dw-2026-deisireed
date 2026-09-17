import { Product } from '../../domain/entities/product.entity';
import { ProductModel } from '../../infrastructure/persistence/models/product.model';
import { ProductResponseDto } from '../dto/product-response.dto';

export class ProductMapper {
  static toResponse(entity: Product): ProductResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      price: Number(entity.price),
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toDomain(model: ProductModel): Product {
    return new Product({
      id: model.id,
      name: model.name,
      price: Number(model.price),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toPersistence(entity: Product): Partial<ProductModel> {
    return {
      ...(entity.id && { id: entity.id }),
      name: entity.name,
      price: entity.price,
    };
  }
}
