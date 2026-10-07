/**
 * Datos de entrada de `PUT /api/turnos-caja/:id` (reemplazo completo).
 * `is_active` **no** está aquí: sólo cambia con `PATCH /api/turnos-caja/:id/deactivate`.
 */
export interface UpdateCashRegisterDto {
  nombre: string;
  descripcion?: string | null;
  empleado_id: number;
}
