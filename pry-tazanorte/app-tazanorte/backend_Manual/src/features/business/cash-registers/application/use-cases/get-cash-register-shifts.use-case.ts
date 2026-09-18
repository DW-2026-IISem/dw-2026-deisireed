import { Injectable, Inject } from '@nestjs/common';
import { CashRegisterShift } from '../../domain/entities/cash-register-shift.entity';
import { CASH_REGISTER_SHIFT_REPOSITORY, ICashRegisterShiftRepository } from '../../domain/interfaces/cash-register-shift-repository.interface';

@Injectable()
export class GetCashRegisterShiftsUseCase {
  constructor(
    @Inject(CASH_REGISTER_SHIFT_REPOSITORY)
    private readonly cashRegisterShiftRepository: ICashRegisterShiftRepository,
  ) {}

  async execute(): Promise<CashRegisterShift[]> {
    return this.cashRegisterShiftRepository.findAll();
  }
}
