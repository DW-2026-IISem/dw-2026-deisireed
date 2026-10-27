import { bearerSecurity, forbiddenResponse, unauthorizedResponse } from "./swagger-security";

/**
 * Genera los `paths` OpenAPI del CRUD estándar de un feature (7 operaciones).
 * Cada feature solo declara sus esquemas (`Xxx`, `XxxCreate`, `XxxUpdate`, `XxxPatch`).
 *
 * `secured: true` documenta la modalidad **JWT + RBAC**: añade `security: bearerAuth`
 * y las respuestas 401/403 a cada operación. Sin la opción, la operación es SIN AUTH.
 */
export interface CrudSwaggerOptions {
  basePath: string;       // "/api/empleados"
  tag: string;            // "Empleados"
  listKey: string;        // "employees"  (clave del arreglo en getAll)
  itemKey: string;        // "employee"   (clave del objeto en las demás)
  schema: string;         // "Employee"   (nombre del esquema base)
  uniqueField?: string;   // si existe, se documenta el 409
  activeField?: string;   // campo de borrado lógico (por defecto "is_active")
  secured?: boolean;      // por defecto true (JWT + RBAC); false -> SIN AUTH
}

export function crudPaths(o: CrudSwaggerOptions): Record<string, unknown> {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const secured = o.secured !== false; // por defecto JWT + RBAC (ISS-20)
  const mode = secured ? "JWT + RBAC" : "SIN AUTH";
  const active = o.activeField ?? "is_active";
  const inactive = active === "status" ? "status = inactive" : `${active} = false`;
  const auth = secured ? { security: bearerSecurity } : {};
  const authResponses = secured ? { "401": unauthorizedResponse, "403": forbiddenResponse } : {};
  const idParam = [
    {
      name: "id",
      in: "path",
      required: true,
      description: "id numérico (> 0). Si no lo es, la API responde 400.",
      schema: { type: "integer", minimum: 1 },
    },
  ];
  const invalidId = { description: "id inválido (debe ser un entero positivo)" };
  const notFound = { description: "No encontrado" };
  const dup = o.uniqueField
    ? { "409": { description: `Ya existe un registro con ese ${o.uniqueField}` } }
    : {};
  const body = (name: string) => ({
    required: true,
    content: { "application/json": { schema: ref(name) } },
  });
  const item = (description: string) => ({
    description,
    content: {
      "application/json": {
        schema: { type: "object", properties: { [o.itemKey]: ref(o.schema) } },
      },
    },
  });

  return {
    [o.basePath]: {
      get: {
        tags: [o.tag],
        summary: "Listar activos",
        description: `${mode} — retorna los registros activos`,
        ...auth,
        responses: {
          "200": {
            description: "Lista",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { [o.listKey]: { type: "array", items: ref(o.schema) } },
                },
              },
            },
          },
          ...authResponses,
        },
      },
      post: {
        tags: [o.tag],
        summary: "Crear",
        description: mode,
        ...auth,
        requestBody: body(`${o.schema}Create`),
        responses: {
          "201": item("Creado"),
          "400": { description: "Datos inválidos" },
          ...authResponses,
          ...dup,
        },
      },
    },
    [`${o.basePath}/{id}`]: {
      get: {
        tags: [o.tag],
        summary: "Obtener por id",
        description: `${mode} — 404 si no existe o tiene borrado lógico`,
        ...auth,
        parameters: idParam,
        responses: { "200": item("Encontrado"), "400": invalidId, ...authResponses, "404": notFound },
      },
      put: {
        tags: [o.tag],
        summary: "Actualizar (PUT — reemplazo)",
        description: `${mode} — el estado no se envía; solo cambia con /deactivate`,
        ...auth,
        parameters: idParam,
        requestBody: body(`${o.schema}Update`),
        responses: { "200": item("Actualizado"), "400": invalidId, ...authResponses, "404": notFound, ...dup },
      },
      patch: {
        tags: [o.tag],
        summary: "Actualizar (PATCH — parcial)",
        description: `${mode} — solo cambia los campos enviados`,
        ...auth,
        parameters: idParam,
        requestBody: body(`${o.schema}Patch`),
        responses: { "200": item("Actualizado"), "400": invalidId, ...authResponses, "404": notFound, ...dup },
      },
      delete: {
        tags: [o.tag],
        summary: "Eliminar (físico)",
        description: `${mode} — borra la fila (también si tiene borrado lógico)`,
        ...auth,
        parameters: idParam,
        responses: { "200": { description: "Eliminado" }, "400": invalidId, ...authResponses, "404": notFound },
      },
    },
    [`${o.basePath}/{id}/deactivate`]: {
      patch: {
        tags: [o.tag],
        summary: "Eliminar (lógico)",
        description: `${mode} — ${inactive}`,
        ...auth,
        parameters: idParam,
        responses: { "200": { description: "Desactivado" }, "400": invalidId, ...authResponses, "404": notFound },
      },
    },
  };
}
