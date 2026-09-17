import { Status } from '../../../../../common/enums/status.enum';

export interface OrderProps {
  id?: number;
  clienteId: number;
  origenId?: number;
  canal: string;
  fecha?: Date;
  subtotal: number;
  total: number;
  estado?: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  id?: number;
  clienteId: number;
  origenId?: number;
  canal: string;
  fecha: Date;
  subtotal: number;
  total: number;
  estado: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: OrderProps) {
    this.id = props.id;
    this.clienteId = props.clienteId;
    this.origenId = props.origenId;
    this.canal = props.canal;
    this.fecha = props.fecha ?? new Date();
    this.subtotal = props.subtotal;
    this.total = props.total;
    this.estado = props.estado ?? 'PENDING';
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<OrderProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Order {
    if (!props.clienteId) {
      throw new Error('El clienteId es requerido');
    }
    if (!props.canal?.trim()) {
      throw new Error('El canal es requerido');
    }
    if (props.subtotal < 0) {
      throw new Error('El subtotal no puede ser negativo');
    }
    if (props.total < 0) {
      throw new Error('El total no puede ser negativo');
    }

    return new Order(props);
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  update(props: Partial<Omit<OrderProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>>): void {
    if (props.canal !== undefined) {
      if (!props.canal.trim()) throw new Error('El canal no puede estar vacío');
      this.canal = props.canal;
    }
    if (props.subtotal !== undefined) {
      if (props.subtotal < 0) throw new Error('El subtotal no puede ser negativo');
      this.subtotal = props.subtotal;
    }
    if (props.total !== undefined) {
      if (props.total < 0) throw new Error('El total no puede ser negativo');
      this.total = props.total;
    }
    if (props.estado !== undefined) {
      this.estado = props.estado;
    }
    if (props.origenId !== undefined) {
      this.origenId = props.origenId;
    }
  }

  deactivate(): void {
    this.status = Status.INACTIVE;
  }
}
