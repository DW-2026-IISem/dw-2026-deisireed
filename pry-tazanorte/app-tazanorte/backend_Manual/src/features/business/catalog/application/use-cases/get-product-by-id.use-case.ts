import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product-repository.interface';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}

  async execute(id: number) {
    const product = await this.repo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    return product;
  }
}
