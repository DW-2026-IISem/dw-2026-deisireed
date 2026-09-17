import { Inject, Injectable } from '@nestjs/common';
import { Status } from '../../../../../common/enums/status.enum';
import { SaleNotFoundException } from '../../domain/exceptions/sale-not-found.exception';
import {
  type ISaleRepository,
  SALE_REPOSITORY,
} from '../../domain/interfaces/sale-repository.interface';
import { SaleMapper } from '../mappers/sale.mapper';

@Injectable()
export class CancelSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(id: number) {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new SaleNotFoundException(id);
    }

    if (sale.status === Status.INACTIVE) {
      return SaleMapper.toResponse(sale);
    }

    sale.cancel();
    const updated = await this.saleRepository.update(sale);
    return SaleMapper.toResponse(updated);
  }
}
