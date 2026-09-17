import { Inject, Injectable } from '@nestjs/common';
import {
  type ISaleRepository,
  SALE_REPOSITORY,
} from '../../domain/interfaces/sale-repository.interface';
import { SaleFilterDto } from '../dto/sale-filter.dto';
import { SaleMapper } from '../mappers/sale.mapper';

@Injectable()
export class ListSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(filter: SaleFilterDto) {
    const result = await this.saleRepository.findAll(filter);
    return {
      items: result.items.map((sale) => SaleMapper.toResponse(sale)),
      meta: result.meta,
    };
  }
}
