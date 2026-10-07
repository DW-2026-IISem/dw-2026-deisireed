import { Order, OrderI } from "../order.model";
import { OrderItemResponseDto } from "../../order-items/dto";

/**
 * Respuesta HTTP de un pedido. Lo usan `GET /api/pedidos`, `GET /api/pedidos/:id`
 * y la salida de update/estado/cancelación.
 *
 * `items` es opcional porque el pedido puede leerse con o sin sus líneas; cuando
 * viaja, cada línea ya es un `OrderItemResponseDto`, nunca una instancia de Sequelize.
 */
export type OrderResponseDto = OrderI & { items?: OrderItemResponseDto[] };

/** Salida de `POST /api/pedidos`: la cabecera creada y sus líneas. */
export interface CreateOrderResultDto {
  order: OrderResponseDto;
  items: OrderItemResponseDto[];
}

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toOrderResponse(order: Order): OrderResponseDto {
  return order.toJSON() as OrderResponseDto;
}
