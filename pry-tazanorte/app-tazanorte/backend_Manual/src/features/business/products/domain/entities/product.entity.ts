import { Status } from '../../../../../common/enums/status.enum';

export interface ProductProps {
  id?: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  isActive?: boolean;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  id?: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  isActive: boolean;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ProductProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion;
    this.precio = props.precio;
    this.isActive = props.isActive ?? true;
    this.status = props.status ?? Status.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<ProductProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Product {
    if (!props.sku?.trim()) throw new Error('El SKU es obligatorio');
    if (!props.nombre?.trim()) throw new Error('El nombre es obligatorio');
    if (props.precio < 0) throw new Error('El precio no puede ser negativo');

    return new Product(props);
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }
}
