import { Module } from '@nestjs/common';
import { CashRegistersController } from './presentation/controllers/cash-registers.controller';
import { CreateCashRegisterShiftUseCase } from './application/use-cases/create-cash-register-shift.use-case';
import { GetCashRegisterShiftsUseCase } from './application/use-cases/get-cash-register-shifts.use-case';
import { cashRegisterShiftRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-cash-register-shift.repository';

@Module({
  controllers: [CashRegistersController],
  providers: [
    cashRegisterShiftRepositoryProvider,
    CreateCashRegisterShiftUseCase,
    GetCashRegisterShiftsUseCase,
  ],
  exports: [cashRegisterShiftRepositoryProvider],
})
export class CashRegistersModule {}
