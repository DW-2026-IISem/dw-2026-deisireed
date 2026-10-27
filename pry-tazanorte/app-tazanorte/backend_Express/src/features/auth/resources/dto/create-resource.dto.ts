/** Verbos HTTP que puede tener un recurso. */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Datos de entrada de `POST /api/recursos`.
 *
 * `path` se guarda con el patrón (`/api/productos/:id`), no con un valor concreto.
 */
export interface CreateResourceDto {
  method: HttpMethod;
  path: string;
  description?: string | null;
  status?: "active" | "inactive";
}
