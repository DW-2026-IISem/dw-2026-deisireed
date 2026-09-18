import { Module } from '@nestjs/common';
import { supplyRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-supply.repository';

@Module({
  providers: [supplyRepositoryProvider],
  exports: [supplyRepositoryProvider],
})
export class StockModule {}
