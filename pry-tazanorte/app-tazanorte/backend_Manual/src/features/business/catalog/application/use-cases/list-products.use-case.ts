import { Inject, Injectable } from '@nestjs/common';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/interfaces/product-repository.interface';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(filter: ProductFilterDto) {
    const result = await this.productRepository.findAll(filter);
    return {
      items: result.items.map((p) => ProductMapper.toResponse(p)),
      meta: result.meta,
    };
  }
}
