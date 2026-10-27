import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

const tag = "ConcesionesRol";
const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }];
const secured = { security: bearerSecurity };
const byId = { "400": invalidIdResponse, "401": unauthorizedResponse, "403": forbiddenResponse, "404": notFoundResponse };

/**
 * Documentación OpenAPI del feature ResourceRoles (conceder recursos a roles).
 * Una concesión activa **es** el permiso. Modalidad: **JWT + RBAC** (efectiva en ISS-20).
 */
export const resourceRolesSwagger = {
  tags: [{ name: tag, description: "Matriz de permisos: concesión de recursos a roles — **JWT + RBAC**" }],
  paths: {
    "/api/concesiones-rol": {
      get: {
        tags: [tag],
        summary: "Listar concesiones activas",
        ...secured,
        parameters: [
          { name: "role_id", in: "query", required: false, schema: { type: "integer" }, description: "Filtrar por rol" },
          { name: "resource_id", in: "query", required: false, schema: { type: "integer" }, description: "Filtrar por recurso" },
        ],
        responses: { "200": { description: "`{ grants: [...] }` con resumen de rol y recurso" }, "401": unauthorizedResponse, "403": forbiddenResponse },
      },
      post: {
        tags: [tag],
        summary: "Conceder recurso a rol",
        description: "Si la concesión existía inactiva, se reactiva. El efecto es inmediato.",
        ...secured,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResourceRoleCreate" } } },
        },
        responses: {
          "201": { description: "Concedido (`{ message, grant }`)" },
          "400": { description: "Faltan `role_id` o `resource_id`" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Rol o recurso inexistente o inactivo" },
          "409": { description: "El rol ya tiene ese recurso" },
        },
      },
    },
    "/api/concesiones-rol/{id}": {
      get: { tags: [tag], summary: "Consultar concesión", ...secured, parameters: idParam, responses: { "200": { description: "`{ grant }`" }, ...byId } },
    },
    "/api/concesiones-rol/{id}/deactivate": {
      patch: {
        tags: [tag],
        summary: "Retirar permiso",
        description: "`status = inactive`. La revocación es **inmediata** (`authorize` consulta la matriz en cada petición).",
        ...secured,
        parameters: idParam,
        responses: { "200": { description: "Retirado" }, ...byId },
      },
    },
    "/api/concesiones-rol/{id}/reactivate": {
      patch: {
        tags: [tag],
        summary: "Reactivar permiso",
        ...secured,
        parameters: idParam,
        responses: { "200": { description: "Reactivado" }, ...byId, "409": { description: "Ya estaba activo" } },
      },
    },
  },
  components: {
    schemas: {
      ResourceRoleCreate: {
        type: "object",
        required: ["role_id", "resource_id"],
        properties: {
          role_id: { type: "integer", example: 3 },
          resource_id: { type: "integer", example: 57 },
        },
      },
    },
  },
};
