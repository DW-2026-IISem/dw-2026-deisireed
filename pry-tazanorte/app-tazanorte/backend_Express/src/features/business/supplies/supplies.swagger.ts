import { crudPaths } from "../../../shared/http/swagger-crud";

/**
 * Documentación OpenAPI del feature Supply.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 * Leyenda: todos los endpoints son **SIN AUTH** (la Fase I no implementa autenticación).
 */
export const suppliesSwagger = {
  tags: [{ name: "Insumos", description: "CRUD de insumos — **SIN AUTH**" }],
  paths: crudPaths({
    basePath: "/api/insumos",
    tag: "Insumos",
    listKey: "supplies",
    itemKey: "supply",
    schema: "Supply",
    uniqueField: "codigo",
  }),
  components: {
    schemas: {
      Supply: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          codigo: { type: "string", example: "INS-0001" },
          nombre: { type: "string", example: "Café en grano" },
          unidad_medida: { type: "string", example: "kg" },
          stock_minimo: { type: "number", example: 5 },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SupplyCreate: {
        type: "object",
        required: ["codigo", "nombre", "unidad_medida"],
        properties: {
          codigo: { type: "string", example: "INS-0100" },
          nombre: { type: "string" },
          unidad_medida: { type: "string", example: "kg" },
          stock_minimo: { type: "number", minimum: 0, default: 0 },
          is_active: { type: "boolean", default: true },
        },
      },
      SupplyUpdate: {
        type: "object",
        required: ["codigo", "nombre", "unidad_medida", "stock_minimo"],
        properties: {
          codigo: { type: "string" },
          nombre: { type: "string" },
          unidad_medida: { type: "string" },
          stock_minimo: { type: "number", minimum: 0 },
        },
      },
      SupplyPatch: {
        type: "object",
        properties: {
          codigo: { type: "string" },
          nombre: { type: "string" },
          unidad_medida: { type: "string" },
          stock_minimo: { type: "number", minimum: 0 },
        },
      },
    },
  },
};
