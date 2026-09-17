import { Product } from '../../domain/entities/product.entity';
import { ProductModel } from '../../infrastructure/persistence/models/product.model';
import { ProductResponseDto } from '../dto/product-response.dto';

export class ProductMapper {
  static toDomain(model: ProductModel): Product {
    return Product.reconstitute({
      id: model.id,
      sku: model.sku,
      nombre: model.nombre,
      descripcion: model.descripcion,
      precio: Number(model.precio),
      isActive: model.isActive,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Product): ProductResponseDto {
    return {
      id: entity.id!,
      sku: entity.sku,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      precio: entity.precio,
      isActive: entity.isActive,
    };
  }

  static toPersistence(entity: Product): Partial<ProductModel> {
    return {
      id: entity.id,
      sku: entity.sku,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      precio: entity.precio,
      isActive: entity.isActive,
      status: entity.status,
    };
  }
}
