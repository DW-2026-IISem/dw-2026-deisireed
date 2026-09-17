import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/interfaces/product-repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto) {
    const product = Product.create(dto);
    const created = await this.productRepository.create(product);
    return ProductMapper.toResponse(created);
  }
}
