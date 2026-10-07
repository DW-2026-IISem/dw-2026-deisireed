/**
 * Datos de entrada de `PUT /api/productos/:id` (reemplazo completo).
 *
 * `is_active` **no** está aquí a propósito: el estado sólo cambia con el
 * borrado lógico (`PATCH /api/productos/:id/deactivate`).
 */
export interface UpdateProductDto {
  sku: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
}
