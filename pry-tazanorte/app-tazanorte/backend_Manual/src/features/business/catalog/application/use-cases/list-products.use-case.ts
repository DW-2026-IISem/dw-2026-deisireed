import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product-repository.interface';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}

  async execute() {
    return this.repo.findAll();
  }
}
