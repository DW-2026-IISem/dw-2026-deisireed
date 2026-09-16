import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/interfaces/product-repository.interface';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return ProductMapper.toResponse(product);
  }
}
