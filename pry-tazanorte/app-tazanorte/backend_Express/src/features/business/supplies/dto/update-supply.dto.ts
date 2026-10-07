/**
 * Datos de entrada de `PUT /api/insumos/:id` (reemplazo completo).
 * `is_active` **no** está aquí: sólo cambia con `PATCH /api/insumos/:id/deactivate`.
 */
export interface UpdateSupplyDto {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  stock_minimo: number;
}
