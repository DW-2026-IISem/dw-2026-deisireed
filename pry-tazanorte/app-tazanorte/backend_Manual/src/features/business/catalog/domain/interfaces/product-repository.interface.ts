import { Product } from '../entities/product.entity';
import { ProductFilterDto } from '../../application/dto/product-filter.dto';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface PaginatedProducts {
  items: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  findAll(filter: ProductFilterDto): Promise<PaginatedProducts>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
