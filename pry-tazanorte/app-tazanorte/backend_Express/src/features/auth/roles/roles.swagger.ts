import { crudPaths } from "../../../shared/http/swagger-crud";

/**
 * Documentación OpenAPI del feature Roles.
 * Modalidad: **JWT + RBAC** (se hace efectiva en ISS-20).
 * El nombre del rol no autoriza nada: los permisos son las concesiones (`resource_roles`).
 */
export const rolesSwagger = {
  tags: [{ name: "Roles", description: "Catálogo de roles — **JWT + RBAC**" }],
  paths: crudPaths({
    basePath: "/api/roles",
    tag: "Roles",
    listKey: "roles",
    itemKey: "role",
    schema: "Role",
    uniqueField: "name",
    activeField: "status",
    secured: true,
  }),
  components: {
    schemas: {
      Role: {
        type: "object",
        properties: {
          id: { type: "integer", example: 2 },
          name: { type: "string", example: "CAJA" },
          description: { type: "string", nullable: true, example: "Caja: registra pedidos, pagos y puntos de fidelización" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "DOMICILIOS", description: "Se guarda en MAYÚSCULAS" },
          description: { type: "string", nullable: true, example: "Entrega de pedidos para llevar" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      RoleUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      RolePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
