/** Datos de entrada de `POST /api/turnos-caja`. */
export interface CreateCashRegisterDto {
  nombre: string;
  descripcion?: string | null;
  empleado_id: number;
  /** Opcional: por defecto `true`. Tras crearlo, el estado sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
