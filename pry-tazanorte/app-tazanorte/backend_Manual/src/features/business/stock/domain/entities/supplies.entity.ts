import { Status } from '../../../../../common/enums/status.enum';

export class Supply {
  id?: number;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  stockMinimo: number;
  isActive: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Supply>) {
    Object.assign(this, partial);
  }
}
