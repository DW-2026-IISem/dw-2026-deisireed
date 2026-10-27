/** Datos de entrada de `POST /api/insumo-pedido-detalles`. */
export interface CreateSupplyOrderItemDto {
  pedido_detalle_id: number;
  insumo_id: number;
  cantidad_usada: number;
  /** Opcional: por defecto `true`. Tras crearlo, sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
