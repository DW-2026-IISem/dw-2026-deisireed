/** Datos de entrada de `POST /api/detalle-pedidos`. */
export interface CreateOrderItemDto {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  observaciones?: string | null;
  /** Opcional: por defecto `true`. Tras crearla, sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
