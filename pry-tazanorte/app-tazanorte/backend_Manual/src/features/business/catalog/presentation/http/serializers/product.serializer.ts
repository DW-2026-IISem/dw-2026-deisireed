import { Product } from '../../../domain/entities/product.entity';
import { ProductResponseDto } from '../../../application/dto/product-response.dto';
import { ProductMapper } from '../../../application/mappers/product.mapper';

export class ProductSerializer {
  static serialize(entity: Product): ProductResponseDto {
    return ProductMapper.toResponse(entity);
  }
}
