import { bearerSecurity, openSecurity, unauthorizedResponse } from "../../../shared/http/swagger-security";

const tag = "Sesion";
const json = (schema: string) => ({
  required: true,
  content: { "application/json": { schema: { $ref: `#/components/schemas/${schema}` } } },
});
const tokens = {
  description: "Par de tokens",
  content: { "application/json": { schema: { $ref: "#/components/schemas/SessionTokens" } } },
};

/**
 * Documentación OpenAPI del feature Session.
 *
 * - **OPEN** (`security: []`, anula la seguridad global): login, refresh, logout.
 * - **JWT**: perfil y permisos propios (sin 403: no pasan por la matriz RBAC).
 */
export const sessionSwagger = {
  tags: [{ name: tag, description: "Login, renovación, cierre de sesión y perfil — **OPEN** / **JWT**" }],
  paths: {
    "/api/sesion/login": {
      post: {
        tags: [tag],
        summary: "Iniciar sesión",
        description: "**OPEN**. `identifier` acepta username o email. Misma respuesta 401 si el usuario no existe, está inactivo o la contraseña es incorrecta.",
        security: openSecurity,
        requestBody: json("Login"),
        responses: {
          "200": tokens,
          "400": { description: "Faltan `identifier` o `password`" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/sesion/refresh": {
      post: {
        tags: [tag],
        summary: "Renovar el access token (rota el refresh token)",
        description:
          "**OPEN** con refresh token. Devuelve un par nuevo; el refresh usado queda inválido. " +
          "Si se presenta un refresh **ya usado**, se revoca toda la familia (posible robo).",
        security: openSecurity,
        requestBody: json("RefreshToken"),
        responses: {
          "200": tokens,
          "400": { description: "Falta `refresh_token`" },
          "401": { description: "Inválido, expirado, reutilizado o usuario inactivo" },
        },
      },
    },
    "/api/sesion/logout": {
      post: {
        tags: [tag],
        summary: "Cerrar sesión",
        description: "**OPEN** con refresh token. Revoca esa sesión. Idempotente.",
        security: openSecurity,
        requestBody: json("RefreshToken"),
        responses: { "200": { description: "`{ message }`" }, "400": { description: "Falta `refresh_token`" } },
      },
    },
    "/api/sesion/perfil": {
      get: {
        tags: [tag],
        summary: "Mi perfil",
        description: "**JWT**. Datos públicos del usuario autenticado.",
        security: bearerSecurity,
        responses: { "200": { description: "`{ user }`" }, "401": unauthorizedResponse },
      },
    },
    "/api/permisos": {
      get: {
        tags: [tag],
        summary: "Mis permisos efectivos",
        description: "**JWT**. Las operaciones `(method, path)` que la matriz RBAC me concede, con el rol que las otorga.",
        security: bearerSecurity,
        responses: { "200": { description: "`{ permissions: [...] }`" }, "401": unauthorizedResponse },
      },
    },
  },
  components: {
    schemas: {
      Login: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: { type: "string", example: "caja", description: "username o email" },
          password: { type: "string", format: "password", example: "Caja123!" },
        },
      },
      RefreshToken: {
        type: "object",
        required: ["refresh_token"],
        properties: { refresh_token: { type: "string", description: "El `refresh_token` del login o del último refresh" } },
      },
      SessionTokens: {
        type: "object",
        properties: {
          access_token: { type: "string", description: "JWT para `Authorization: Bearer`" },
          token_type: { type: "string", example: "Bearer" },
          expires_in: { type: "integer", example: 900 },
          refresh_token: { type: "string" },
          refresh_expires_in: { type: "integer", example: 604800 },
        },
      },
    },
  },
};
