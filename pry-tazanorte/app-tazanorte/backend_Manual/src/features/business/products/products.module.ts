import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product-repository.interface';
import { ProductRepository } from './infrastructure/persistence/repositories/product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ProductsController } from './presentation/http/controllers/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductRepository,
    { provide: PRODUCT_REPOSITORY, useExisting: ProductRepository },
    CreateProductUseCase,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
