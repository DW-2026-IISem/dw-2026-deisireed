import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [ClientsModule, ProductsModule, SalesModule],
  exports: [ClientsModule, ProductsModule, SalesModule],
})
export class BusinessModule {}
