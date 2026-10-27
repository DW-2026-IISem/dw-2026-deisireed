/**
 * Respuesta de login y refresh: el par de tokens.
 *  - `access_token`: JWT de vida corta (`expires_in` segundos). Va en `Authorization: Bearer`.
 *  - `refresh_token`: token opaco de vida larga; solo sirve para `/refresh` y `/logout`.
 */
export interface SessionTokensDto {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

/** Respuesta de `GET /api/sesion/perfil`: datos públicos del usuario autenticado. */
export interface ProfileDto {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: "active" | "inactive";
}
