import { Module } from '@nestjs/common';
import { SuppliesController } from './presentation/controllers/supplies.controller';
import { CreateSupplyUseCase } from './application/use-cases/create-supply.use-case';
import { GetSuppliesUseCase } from './application/use-cases/get-supplies.use-case';
import { supplyRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-supply.repository';

@Module({
  controllers: [SuppliesController],
  providers: [
    supplyRepositoryProvider,
    CreateSupplyUseCase,
    GetSuppliesUseCase,
  ],
  exports: [supplyRepositoryProvider],
})
export class SuppliesModule {}
