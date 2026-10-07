/** Datos de entrada de `POST /api/productos`. */
export interface CreateProductDto {
  sku: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  /** Opcional: por defecto `true`. Tras crearlo, el estado sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
