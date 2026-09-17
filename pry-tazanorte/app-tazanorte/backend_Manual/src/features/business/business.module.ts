import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ClientsModule, OrdersModule],
  exports: [ClientsModule, OrdersModule],
})
export class BusinessModule {}
