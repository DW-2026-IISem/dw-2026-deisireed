import { OrderChannel } from "../order.model";

/**
 * Datos de entrada de `PUT /api/pedidos/:id` (reemplazo de la cabecera).
 * Solo se puede editar mientras el pedido esté `pendiente`.
 *
 * `estado` **no** está aquí: cambia con `PATCH /api/pedidos/:id/estado`.
 * `subtotal` y `total` son derivados: se recalculan desde las líneas.
 * Los líneas se gestionan en `/api/detalle-pedidos`.
 */
export interface UpdateOrderDto {
  /** Si no se envía, se conserva el cliente actual. */
  cliente_id?: number;
  /** Si no se envía, se conserva el turno actual. */
  turno_caja_id?: number;
  canal: OrderChannel;
  fecha?: Date | string;
}
