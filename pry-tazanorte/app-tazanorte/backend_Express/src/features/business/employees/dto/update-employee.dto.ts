/**
 * Datos de entrada de `PUT /api/empleados/:id` (reemplazo completo).
 * `is_active` **no** está aquí: sólo cambia con `PATCH /api/empleados/:id/deactivate`.
 */
export interface UpdateEmployeeDto {
  nombre: string;
  descripcion?: string | null;
}
