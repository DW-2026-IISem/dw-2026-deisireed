import { Inject, Injectable } from '@nestjs/common';
import { SaleNotFoundException } from '../../domain/exceptions/sale-not-found.exception';
import {
  type ISaleRepository,
  SALE_REPOSITORY,
} from '../../domain/interfaces/sale-repository.interface';
import { SaleMapper } from '../mappers/sale.mapper';

@Injectable()
export class GetSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(id: number) {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new SaleNotFoundException(id);
    }

    return SaleMapper.toResponse(sale);
  }
}
