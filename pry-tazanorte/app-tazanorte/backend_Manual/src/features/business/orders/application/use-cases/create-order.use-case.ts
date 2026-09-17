import { Inject, Injectable } from '@nestjs/common';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client-not-found.exception';
import {
  type IClientRepository,
  CLIENT_REPOSITORY,
} from '../../../clients/domain/interfaces/client-repository.interface';
import { Order } from '../../domain/entities/order.entity';
import {
  type IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/interfaces/order-repository.interface';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(dto: CreateOrderDto) {
    const client = await this.clientRepository.findById(dto.clienteId);
    if (!client) {
      throw new ClientNotFoundException(dto.clienteId);
    }

    const order = Order.create(dto);
    const created = await this.orderRepository.create(order);
    return OrderMapper.toResponse(created);
  }
}
