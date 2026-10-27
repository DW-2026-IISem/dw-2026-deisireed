/** Datos de entrada de `POST /api/concesiones-rol` (conceder un recurso a un rol). */
export interface CreateResourceRoleDto {
  role_id: number;
  resource_id: number;
}
