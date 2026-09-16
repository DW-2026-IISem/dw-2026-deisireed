export interface ProductProps {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
}

export class Product {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;

  private constructor(props: ProductProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.isActive = props.isActive ?? true;
  }

  static create(props: Omit<ProductProps, 'id' | 'isActive'>): Product {
    if (!props.sku?.trim()) throw new Error('El SKU es requerido');
    if (!props.name?.trim()) throw new Error('El nombre es requerido');
    if (props.price < 0) throw new Error('El precio debe ser mayor o igual a 0');
    return new Product(props);
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }
}
