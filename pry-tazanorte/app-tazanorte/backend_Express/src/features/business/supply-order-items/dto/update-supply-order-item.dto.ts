/**
 * Datos de entrada de `PUT /api/insumo-pedido-detalles/:id` (reemplazo completo).
 * `is_active` **no** está aquí: sólo cambia con `PATCH .../:id/deactivate`.
 */
export interface UpdateSupplyOrderItemDto {
  pedido_detalle_id: number;
  insumo_id: number;
  cantidad_usada: number;
}
