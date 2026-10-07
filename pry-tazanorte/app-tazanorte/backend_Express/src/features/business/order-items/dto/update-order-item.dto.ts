/**
 * Datos de entrada de `PUT /api/detalle-pedidos/:id` (reemplazo completo).
 *
 * `is_active` **no** está aquí a propósito: desactivar una línea obliga a
 * recalcular el pedido, y eso lo garantiza el borrado lógico
 * (`PATCH /api/detalle-pedidos/:id/deactivate`).
 * `valor_unitario` y `total` son derivados: los calcula el service.
 */
export interface UpdateOrderItemDto {
  cantidad: number;
  /** En PUT, si no llega se reemplaza por `null`. */
  observaciones?: string | null;
}
