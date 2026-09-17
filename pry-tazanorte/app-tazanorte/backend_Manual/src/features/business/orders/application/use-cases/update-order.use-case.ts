import { Inject, Injectable } from '@nestjs/common';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client-not-found.exception';
import {
  type IClientRepository,
  CLIENT_REPOSITORY,
} from '../../../clients/domain/interfaces/client-repository.interface';
import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import {
  type IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/interfaces/order-repository.interface';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(id: number, dto: UpdateOrderDto) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundException(id);
    }

    if (dto.clienteId) {
      const client = await this.clientRepository.findById(dto.clienteId);
      if (!client) {
        throw new ClientNotFoundException(dto.clienteId);
      }
    }

    order.update(dto);
    const updated = await this.orderRepository.update(order);
    return OrderMapper.toResponse(updated);
  }
}
