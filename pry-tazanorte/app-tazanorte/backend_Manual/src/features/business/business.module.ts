import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ClientsModule, ProductsModule, OrdersModule],
  exports: [ClientsModule, ProductsModule, OrdersModule],
})
export class BusinessModule {}
