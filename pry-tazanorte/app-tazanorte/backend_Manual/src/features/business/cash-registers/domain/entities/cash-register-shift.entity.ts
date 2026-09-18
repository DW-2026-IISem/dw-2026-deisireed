import { Status } from '../../../../../common/enums/status.enum';

export class CashRegisterShift {
  id?: number;
  nombre: string;
  descripcion?: string;
  isActive: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<CashRegisterShift>) {
    Object.assign(this, partial);
  }
}
