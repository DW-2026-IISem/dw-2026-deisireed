/**
 * Genera los `paths` OpenAPI del CRUD estándar de un feature (SIN AUTH).
 * Cada feature solo declara sus esquemas (`Xxx`, `XxxCreate`, `XxxUpdate`, `XxxPatch`).
 */
export interface CrudSwaggerOptions {
  basePath: string;       // "/api/empleados"
  tag: string;            // "Empleados"
  listKey: string;        // "employees"  (clave del arreglo en getAll)
  itemKey: string;        // "employee"   (clave del objeto en las demás)
  schema: string;         // "Employee"   (nombre del esquema base)
  uniqueField?: string;   // si existe, se documenta el 409
}

export function crudPaths(o: CrudSwaggerOptions): Record<string, unknown> {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
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
        description: "SIN AUTH — retorna registros con is_active=true",
        responses: {
          "200": {
            description: "Lista",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    [o.listKey]: { type: "array", items: ref(o.schema) },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: [o.tag],
        summary: "Crear",
        description: "SIN AUTH",
        requestBody: body(`${o.schema}Create`),
        responses: {
          "201": item("Creado"),
          "400": { description: "Datos inválidos" },
          ...dup,
        },
      },
    },
    [`${o.basePath}/{id}`]: {
      get: {
        tags: [o.tag],
        summary: "Obtener por id",
        description: "SIN AUTH — 404 si no existe o tiene borrado lógico",
        parameters: idParam,
        responses: { "200": item("Encontrado"), "400": invalidId, "404": notFound },
      },
      put: {
        tags: [o.tag],
        summary: "Actualizar (PUT — reemplazo)",
        description: "SIN AUTH — is_active no se envía; solo cambia con /deactivate",
        parameters: idParam,
        requestBody: body(`${o.schema}Update`),
        responses: { "200": item("Actualizado"), "400": invalidId, "404": notFound, ...dup },
      },
      patch: {
        tags: [o.tag],
        summary: "Actualizar (PATCH — parcial)",
        description: "SIN AUTH — solo cambia los campos enviados",
        parameters: idParam,
        requestBody: body(`${o.schema}Patch`),
        responses: { "200": item("Actualizado"), "400": invalidId, "404": notFound, ...dup },
      },
      delete: {
        tags: [o.tag],
        summary: "Eliminar (físico)",
        description: "SIN AUTH — borra la fila (también si tiene borrado lógico)",
        parameters: idParam,
        responses: { "200": { description: "Eliminado" }, "400": invalidId, "404": notFound },
      },
    },
    [`${o.basePath}/{id}/deactivate`]: {
      patch: {
        tags: [o.tag],
        summary: "Eliminar (lógico)",
        description: "SIN AUTH — is_active = false",
        parameters: idParam,
        responses: { "200": { description: "Desactivado" }, "400": invalidId, "404": notFound },
      },
    },
  };
}
