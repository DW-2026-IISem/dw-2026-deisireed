import { OrderItem, OrderItemI } from "../order-item.model";

/**
 * Respuesta HTTP de una línea de pedido. Lo usan `GET /api/detalle-pedidos`,
 * `GET /api/detalle-pedidos/:id` y el array `items` de un pedido.
 */
export type OrderItemResponseDto = OrderItemI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toOrderItemResponse(item: OrderItem): OrderItemResponseDto {
  return item.toJSON() as OrderItemResponseDto;
}
