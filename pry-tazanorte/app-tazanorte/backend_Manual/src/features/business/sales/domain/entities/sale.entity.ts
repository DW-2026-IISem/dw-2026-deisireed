import { Status } from '../../../../../common/enums/status.enum';

export interface SaleItemProps {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
  saleId?: number;
}

export class SaleItem {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  total: number;
  saleId?: number;

  private constructor(props: SaleItemProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.total = props.total;
    this.saleId = props.saleId;
  }

  static create(
    props: Omit<SaleItemProps, 'id' | 'total' | 'saleId'>,
  ): SaleItem {
    if (props.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    if (props.unitPrice <= 0) {
      throw new Error('El precio unitario debe ser mayor a 0');
    }

    const total = props.quantity * props.unitPrice;

    return new SaleItem({
      ...props,
      total,
    });
  }

  static reconstitute(props: SaleItemProps): SaleItem {
    return new SaleItem(props);
  }
}

export interface SaleProps {
  id?: number;
  saleDate: Date;
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
  status?: Status;
  clientId: number;
  items?: SaleItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Sale {
  id?: number;
  saleDate: Date;
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
  status: Status;
  clientId: number;
  items: SaleItem[];
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: SaleProps) {
    this.id = props.id;
    this.saleDate = props.saleDate;
    this.subtotal = props.subtotal;
    this.tax = props.tax;
    this.discounts = props.discounts;
    this.total = props.total;
    this.status = props.status ?? Status.ACTIVE;
    this.clientId = props.clientId;
    this.items = props.items ?? [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<
      SaleProps,
      'id' | 'status' | 'subtotal' | 'total' | 'createdAt' | 'updatedAt'
    > & {
      subtotal: number;
      total: number;
    },
  ): Sale {
    if (!props.items?.length) {
      throw new Error('La venta debe tener al menos un item');
    }

    return new Sale(props);
  }

  static reconstitute(props: SaleProps): Sale {
    return new Sale(props);
  }

  cancel(): void {
    this.status = Status.INACTIVE;
  }
}
