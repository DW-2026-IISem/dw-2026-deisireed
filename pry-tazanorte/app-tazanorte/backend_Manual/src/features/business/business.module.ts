import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ClientsModule, ProductTypesModule, ProductsModule, OrdersModule],
  exports: [ClientsModule, ProductTypesModule, ProductsModule, OrdersModule],
})
export class BusinessModule {}
