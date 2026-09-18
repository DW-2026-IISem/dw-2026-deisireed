import { CashRegisterShift } from '../entities/cash-register-shift.entity';

export const CASH_REGISTER_SHIFT_REPOSITORY = 'CASH_REGISTER_SHIFT_REPOSITORY';

export interface ICashRegisterShiftRepository {
  create(shift: CashRegisterShift): Promise<CashRegisterShift>;
  findAll(): Promise<CashRegisterShift[]>;
  findById(id: number): Promise<CashRegisterShift | null>;
  update(id: number, data: Partial<CashRegisterShift>): Promise<CashRegisterShift>;
  delete(id: number): Promise<void>;
}
