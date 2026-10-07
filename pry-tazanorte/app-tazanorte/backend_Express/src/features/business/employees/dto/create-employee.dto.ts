/** Datos de entrada de `POST /api/empleados`. */
export interface CreateEmployeeDto {
  nombre: string;
  descripcion?: string | null;
  /** Opcional: por defecto `true`. Tras crearlo, el estado sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
