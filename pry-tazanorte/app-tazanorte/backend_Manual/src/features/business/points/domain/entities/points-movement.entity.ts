import { Status } from '../../../../../common/enums/status.enum';

export class PointsMovement {
  id?: number;
  referenciaId: number;
  tipo: string;
  fecha?: Date;
  cantidad: number;
  observaciones?: string;
  estado: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<PointsMovement>) {
    Object.assign(this, partial);
  }
}
