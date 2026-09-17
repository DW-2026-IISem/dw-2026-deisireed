import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Sale } from '../entities/sale.entity';

export const SALE_REPOSITORY = 'SALE_REPOSITORY';

export interface SaleFindAllParams {
  page?: number;
  limit?: number;
  clientId?: number;
}

export interface ISaleRepository {
  create(sale: Sale): Promise<Sale>;
  update(sale: Sale): Promise<Sale>;
  findById(id: number): Promise<Sale | null>;
  findAll(params: SaleFindAllParams): Promise<PaginatedResult<Sale>>;
}
