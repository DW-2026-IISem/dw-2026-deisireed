/** Datos de entrada de `POST /api/insumos`. */
export interface CreateSupplyDto {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  /** Opcional: por defecto 0. */
  stock_minimo?: number;
  /** Opcional: por defecto `true`. Tras crearlo, el estado sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
