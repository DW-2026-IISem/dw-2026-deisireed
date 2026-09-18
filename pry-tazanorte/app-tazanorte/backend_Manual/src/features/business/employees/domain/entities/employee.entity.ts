import { Status } from '../../../../../common/enums/status.enum';

export class Employee {
  id?: number;
  nombre: string;
  descripcion?: string;
  isActive: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial);
  }
}
