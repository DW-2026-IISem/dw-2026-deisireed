import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel } from './infrastructure/persistence/models/product.model';
import { ProductRepository } from './infrastructure/persistence/repositories/product.repository';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product-repository.interface';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { ProductsController } from './presentation/http/controllers/products.controller';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel])],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    GetProductByIdUseCase,
    ListProductsUseCase,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class CatalogModule {}
