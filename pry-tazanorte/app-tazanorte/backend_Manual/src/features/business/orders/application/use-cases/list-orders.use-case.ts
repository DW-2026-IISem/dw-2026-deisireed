import { Inject, Injectable } from '@nestjs/common';
import {
  type IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/interfaces/order-repository.interface';
import { OrderFilterDto } from '../dto/order-filter.dto';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(filter: OrderFilterDto) {
    const result = await this.orderRepository.findAll(filter);
    return {
      items: result.items.map((order) => OrderMapper.toResponse(order)),
      meta: result.meta,
    };
  }
}
