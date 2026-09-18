import { Injectable, Inject } from '@nestjs/common';
import { CashRegisterShift } from '../../domain/entities/cash-register-shift.entity';
import { CASH_REGISTER_SHIFT_REPOSITORY, ICashRegisterShiftRepository } from '../../domain/interfaces/cash-register-shift-repository.interface';
import { CreateCashRegisterShiftDto } from '../../presentation/dtos/create-cash-register-shift.dto';

@Injectable()
export class CreateCashRegisterShiftUseCase {
  constructor(
    @Inject(CASH_REGISTER_SHIFT_REPOSITORY)
    private readonly cashRegisterShiftRepository: ICashRegisterShiftRepository,
  ) {}

  async execute(dto: CreateCashRegisterShiftDto): Promise<CashRegisterShift> {
    const shift = new CashRegisterShift(dto);
    return this.cashRegisterShiftRepository.create(shift);
  }
}
