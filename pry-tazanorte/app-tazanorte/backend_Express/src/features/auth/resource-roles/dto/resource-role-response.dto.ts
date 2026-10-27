import { ResourceRole, ResourceRoleI } from "../resource-role.model";

/** Respuesta HTTP de una concesión, con el resumen del rol y del recurso. */
export interface ResourceRoleResponseDto extends ResourceRoleI {
  role?: { id: number; name: string } | null;
  resource?: { id: number; method: string; path: string; description: string | null } | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceRoleResponse(resourceRole: ResourceRole): ResourceRoleResponseDto {
  return resourceRole.toJSON() as ResourceRoleResponseDto;
}

/**
 * Un permiso efectivo de un usuario: el recurso `(method, path)` y el rol que lo concede.
 * Es lo que devuelven `GET /api/usuarios/:id/permisos` y la consulta de `authorize`.
 */
export interface EffectivePermissionDto {
  resource_id: number;
  method: string;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}
