import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product-repository.interface';
import { ProductRepository } from './infrastructure/persistence/repositories/product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { ProductsController } from './presentation/http/controllers/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductRepository,
    { provide: PRODUCT_REPOSITORY, useExisting: ProductRepository },
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class CatalogModule {}
