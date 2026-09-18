import { Status } from '../../../../../common/enums/status.enum';

export class Supply {
  id?: number;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo?: number;
  costoUnitario?: number;
  isActive: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Supply>) {
    Object.assign(this, partial);
  }
}
