import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Order } from '../../../domain/entities/order.entity';
import {
  IOrderRepository,
  OrderFindAllParams,
} from '../../../domain/interfaces/order-repository.interface';
import { OrderMapper } from '../../../application/mappers/order.mapper';
import { OrderModel } from '../models/order.model';

@Injectable()
export class OrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const model = await OrderModel.create(OrderMapper.toPersistence(order));
    return OrderMapper.toDomain(model);
  }

  async update(order: Order): Promise<Order> {
    await OrderModel.update(OrderMapper.toPersistence(order), {
      where: { id: order.id },
    });
    const updated = await OrderModel.findByPk(order.id!);
    return OrderMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await OrderModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Order | null> {
    const model = await OrderModel.findByPk(id);
    return model ? OrderMapper.toDomain(model) : null;
  }

  async findAll(params: OrderFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: WhereOptions = {};

    if (params.clienteId) {
      where.clienteId = params.clienteId;
    }

    if (params.estado) {
      where.estado = params.estado;
    }

    const { rows, count } = await OrderModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => OrderMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
