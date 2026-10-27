import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

const tag = "AsignacionesRol";
const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }];
const secured = { security: bearerSecurity };
const byId = { "400": invalidIdResponse, "401": unauthorizedResponse, "403": forbiddenResponse, "404": notFoundResponse };

/**
 * Documentación OpenAPI del feature RoleUsers (asignar roles a usuarios).
 * Modalidad: **JWT + RBAC** (se hace efectiva en ISS-20).
 */
export const roleUsersSwagger = {
  tags: [{ name: tag, description: "Asignación de roles a usuarios — **JWT + RBAC**" }],
  paths: {
    "/api/asignaciones-rol": {
      get: {
        tags: [tag],
        summary: "Listar asignaciones activas",
        ...secured,
        responses: { "200": { description: "`{ assignments: [...] }` con resumen de usuario y rol" }, "401": unauthorizedResponse, "403": forbiddenResponse },
      },
      post: {
        tags: [tag],
        summary: "Asignar rol a usuario",
        description: "Si la asignación existía inactiva, se reactiva.",
        ...secured,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleUserCreate" } } },
        },
        responses: {
          "201": { description: "Asignado (`{ message, assignment }`)" },
          "400": { description: "Faltan `user_id` o `role_id`" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Usuario o rol inexistente o inactivo" },
          "409": { description: "El usuario ya tiene ese rol" },
        },
      },
    },
    "/api/asignaciones-rol/{id}": {
      get: { tags: [tag], summary: "Consultar asignación", ...secured, parameters: idParam, responses: { "200": { description: "`{ assignment }`" }, ...byId } },
    },
    "/api/asignaciones-rol/{id}/deactivate": {
      patch: {
        tags: [tag],
        summary: "Retirar rol al usuario",
        description: "`status = inactive`. El usuario pierde los permisos del rol **al instante**.",
        ...secured,
        parameters: idParam,
        responses: { "200": { description: "Retirado" }, ...byId },
      },
    },
    "/api/asignaciones-rol/{id}/reactivate": {
      patch: {
        tags: [tag],
        summary: "Reactivar asignación",
        ...secured,
        parameters: idParam,
        responses: { "200": { description: "Reactivada" }, ...byId, "409": { description: "Ya estaba activa" } },
      },
    },
  },
  components: {
    schemas: {
      RoleUserCreate: {
        type: "object",
        required: ["user_id", "role_id"],
        properties: {
          user_id: { type: "integer", example: 6 },
          role_id: { type: "integer", example: 3 },
        },
      },
    },
  },
};
