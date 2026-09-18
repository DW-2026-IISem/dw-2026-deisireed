import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { ClientsModule } from './features/business/clients/clients.module';
import { ProductsModule } from './features/business/products/products.module';
import { SalesModule } from './features/business/sales/sales.module';
import { EmployeesModule } from './features/business/employees/employees.module';
import { CashRegistersModule } from './features/business/cash-registers/cash-registers.module';
import { PointsModule } from './features/business/points/points.module';
import { UsersModule } from './features/auth/users/users.module';
import { SuppliesModule } from './features/business/supplies/supplies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ClientsModule,
    ProductsModule,
    SalesModule,
    EmployeesModule,
    CashRegistersModule,
    PointsModule,
    UsersModule,
    SuppliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
