import { Status } from '../../../../../common/enums/status.enum';
import { Order } from '../../domain/entities/order.entity';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderModel } from '../../infrastructure/persistence/models/order.model';

export class OrderMapper {
  static toDomain(model: OrderModel): Order {
    return Order.reconstitute({
      id: model.id,
      clienteId: model.clienteId,
      origenId: model.origenId,
      canal: model.canal,
      fecha: model.fecha,
      subtotal: Number(model.subtotal),
      total: Number(model.total),
      estado: model.estado,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Order): OrderResponseDto {
    return {
      id: entity.id!,
      clienteId: entity.clienteId,
      origenId: entity.origenId,
      canal: entity.canal,
      fecha: entity.fecha,
      subtotal: entity.subtotal,
      total: entity.total,
      estado: entity.estado,
      status: entity.status,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Order): Partial<OrderModel> {
    return {
      id: entity.id,
      clienteId: entity.clienteId,
      origenId: entity.origenId,
      canal: entity.canal,
      fecha: entity.fecha,
      subtotal: entity.subtotal,
      total: entity.total,
      estado: entity.estado,
      status: entity.status ?? Status.ACTIVE,
    };
  }
}
