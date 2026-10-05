/**
 * Datos de entrada de `PUT /api/clientes/:id` (reemplazo completo).
 *
 * `is_active` **no** está aquí a propósito: el estado sólo cambia con el
 * borrado lógico (`PATCH /api/clientes/:id/deactivate`).
 */
export interface UpdateClientDto {
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
}
