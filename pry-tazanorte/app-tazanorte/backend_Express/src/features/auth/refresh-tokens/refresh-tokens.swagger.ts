import {
  bearerSecurity,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

const tag = "Sesiones";
const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }];
const jwt = { security: bearerSecurity };

/**
 * Documentación OpenAPI del feature RefreshTokens (sesiones propias).
 *
 * Modalidad: **JWT** (solo `authenticate`). No hay 403: estas rutas no consultan
 * la matriz RBAC; cada usuario ve y revoca **solo sus** sesiones (un id ajeno -> 404).
 */
export const refreshTokensSwagger = {
  tags: [
    {
      name: tag,
      description: "Mis sesiones (refresh tokens persistidos) — **JWT**. Nunca se expone `token_hash`.",
    },
  ],
  paths: {
    "/api/sesiones": {
      get: {
        tags: [tag],
        summary: "Listar mis sesiones activas",
        ...jwt,
        responses: {
          "200": { description: "`{ sessions: [...] }` (sin `token_hash`, con `is_expired`)" },
          "401": unauthorizedResponse,
        },
      },
      delete: {
        tags: [tag],
        summary: "Purgar mis sesiones revocadas o expiradas",
        description: "Borrado físico de las sesiones que ya no sirven. Las activas no se tocan.",
        ...jwt,
        responses: { "200": { description: "`{ message, purged }`" }, "401": unauthorizedResponse },
      },
    },
    "/api/sesiones/deactivate-all": {
      patch: {
        tags: [tag],
        summary: "Cerrar todas mis sesiones",
        description: "Revoca todos mis refresh tokens (p. ej. si sospecho que me robaron uno).",
        ...jwt,
        responses: { "200": { description: "`{ message, revoked }`" }, "401": unauthorizedResponse },
      },
    },
    "/api/sesiones/{id}": {
      get: {
        tags: [tag],
        summary: "Consultar una de mis sesiones",
        ...jwt,
        parameters: idParam,
        responses: {
          "200": { description: "`{ session }`" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/sesiones/{id}/deactivate": {
      patch: {
        tags: [tag],
        summary: "Revocar una de mis sesiones",
        ...jwt,
        parameters: idParam,
        responses: {
          "200": { description: "`{ message, session }`" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Session: {
        type: "object",
        properties: {
          id: { type: "integer", example: 4 },
          user_id: { type: "integer", example: 2 },
          family_id: { type: "string", format: "uuid" },
          device_info: { type: "string", nullable: true, example: "Caja 1 - Chrome" },
          expires_at: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "inactive"] },
          is_expired: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
