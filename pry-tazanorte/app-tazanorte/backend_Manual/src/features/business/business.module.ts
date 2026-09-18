import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { PaymentsModule } from './payments/payments.module';
import { EmployeesModule } from './employees/employees.module';
import { CashRegistersModule } from './cash-registers/cash-registers.module';
import { PointsModule } from './points/points.module';
import { StockModule } from './stock/stock.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ClientsModule,
    ProductsModule,
    SalesModule,
    PaymentsModule,
    EmployeesModule,
    CashRegistersModule,
    PointsModule,
    StockModule,
    RecipesModule,
  ],
  exports: [
    ClientsModule,
    ProductsModule,
    SalesModule,
    PaymentsModule,
    EmployeesModule,
    CashRegistersModule,
    PointsModule,
    StockModule,
    RecipesModule,
  ],
})
export class BusinessModule {}
