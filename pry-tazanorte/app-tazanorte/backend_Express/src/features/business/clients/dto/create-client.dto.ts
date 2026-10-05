/** Datos de entrada de `POST /api/clientes`. */
export interface CreateClientDto {
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  /** Opcional: por defecto `true`. Tras crearlo, el estado sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
