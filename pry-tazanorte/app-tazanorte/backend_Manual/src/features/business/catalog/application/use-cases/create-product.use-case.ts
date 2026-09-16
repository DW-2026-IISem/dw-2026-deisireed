import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto) {
    const product = Product.create(dto);
    return this.repo.create(product);
  }
}
