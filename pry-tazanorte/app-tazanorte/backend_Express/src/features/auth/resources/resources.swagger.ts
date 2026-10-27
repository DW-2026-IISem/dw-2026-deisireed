import { crudPaths } from "../../../shared/http/swagger-crud";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/**
 * Documentación OpenAPI del feature Resources.
 * Modalidad: **JWT + RBAC** (se hace efectiva en ISS-20).
 * Un recurso es el par `(method, path)` con la ruta en patrón (`/api/productos/:id`).
 */
export const resourcesSwagger = {
  tags: [{ name: "Recursos", description: "Catálogo de operaciones protegibles `(method, path)` — **JWT + RBAC**" }],
  paths: crudPaths({
    basePath: "/api/recursos",
    tag: "Recursos",
    listKey: "resources",
    itemKey: "resource",
    schema: "Resource",
    uniqueField: "par (method, path)",
    activeField: "status",
    secured: true,
  }),
  components: {
    schemas: {
      Resource: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          method: { type: "string", enum: methods, example: "GET" },
          path: { type: "string", example: "/api/pedidos/:id" },
          description: { type: "string", nullable: true, example: "Consultar pedido" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceCreate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: methods, example: "GET" },
          path: { type: "string", example: "/api/reportes/ventas-dia", description: "Debe empezar por /api/" },
          description: { type: "string", nullable: true, example: "Reporte de ventas del día" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ResourceUpdate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: methods },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      ResourcePatch: {
        type: "object",
        properties: {
          method: { type: "string", enum: methods },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
