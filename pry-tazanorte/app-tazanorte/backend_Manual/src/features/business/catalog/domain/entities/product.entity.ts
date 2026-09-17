export interface ProductProps {
  id?: number;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private props: ProductProps;

  constructor(props: ProductProps) {
    this.props = props;
  }

  static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    return new Product({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get price(): number {
    return this.props.price;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  update(dto: Partial<Pick<ProductProps, 'name' | 'price'>>): void {
    if (dto.name !== undefined) this.props.name = dto.name;
    if (dto.price !== undefined) this.props.price = dto.price;
    this.props.updatedAt = new Date();
  }
}
