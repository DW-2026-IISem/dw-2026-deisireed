import { HttpMethod } from "./create-resource.dto";

/**
 * Datos de entrada de `PUT /api/recursos/:id` (reemplazo completo).
 * `status` no está aquí: el estado solo cambia con el borrado lógico.
 */
export interface UpdateResourceDto {
  method: HttpMethod;
  path: string;
  description?: string | null;
}
