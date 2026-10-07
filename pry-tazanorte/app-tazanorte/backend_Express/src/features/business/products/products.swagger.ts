/**
 * Documentación OpenAPI del feature Product.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: todos los endpoints son **SIN AUTH** (la Fase I no implementa autenticación).
 */

const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "id numérico (> 0). Si no lo es, la API responde 400.",
  schema: { type: "integer", minimum: 1 },
};

const invalidId = { description: "id inválido (debe ser un entero positivo)" };
const notFound = { description: "No encontrado" };
const duplicated = { description: "Ya existe un producto con ese sku" };

export const productsSwagger = {
  tags: [
    {
      name: "Productos",
      description: "CRUD de productos — **SIN AUTH**",
    },
  ],
  paths: {
    "/api/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos activos",
        description: "SIN AUTH — retorna productos con is_active=true",
        responses: {
          "200": {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Productos"],
        summary: "Crear producto",
        description: "SIN AUTH — sku debe ser único; precio >= 0",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Producto creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          "400": { description: "Datos inválidos (campos obligatorios o precio negativo)" },
          "409": duplicated,
        },
      },
    },
    "/api/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por id",
        description: "SIN AUTH — 404 si no existe o tiene borrado lógico",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Producto encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          "400": invalidId,
          "404": notFound,
        },
      },
      put: {
        tags: ["Productos"],
        summary: "Actualizar producto (PUT — reemplazo)",
        description: "SIN AUTH — is_active no se envía; solo cambia con /deactivate",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": invalidId,
          "404": notFound,
          "409": duplicated,
        },
      },
      patch: {
        tags: ["Productos"],
        summary: "Actualizar producto (PATCH — parcial)",
        description: "SIN AUTH — solo cambia los campos enviados",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": invalidId,
          "404": notFound,
          "409": duplicated,
        },
      },
      delete: {
        tags: ["Productos"],
        summary: "Eliminar producto (físico)",
        description: "SIN AUTH — borra la fila (también si tiene borrado lógico)",
        parameters: [idParam],
        responses: {
          "200": { description: "Eliminado" },
          "400": invalidId,
          "404": notFound,
        },
      },
    },
    "/api/productos/{id}/deactivate": {
      patch: {
        tags: ["Productos"],
        summary: "Eliminar producto (lógico)",
        description: "SIN AUTH — is_active = false",
        parameters: [idParam],
        responses: {
          "200": { description: "Desactivado" },
          "400": invalidId,
          "404": notFound,
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          sku: { type: "string", example: "BEB-0001" },
          nombre: { type: "string", example: "Latte" },
          descripcion: { type: "string", nullable: true, example: "Café con leche vaporizada" },
          precio: { type: "number", example: 8500 },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductCreate: {
        type: "object",
        required: ["sku", "nombre", "precio"],
        properties: {
          sku: { type: "string", example: "BEB-0001" },
          nombre: { type: "string", example: "Latte" },
          descripcion: { type: "string", nullable: true },
          precio: { type: "number", minimum: 0, example: 8500 },
          is_active: { type: "boolean", default: true },
        },
      },
      ProductUpdate: {
        type: "object",
        required: ["sku", "nombre", "precio"],
        properties: {
          sku: { type: "string" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          precio: { type: "number", minimum: 0 },
        },
      },
      ProductPatch: {
        type: "object",
        properties: {
          sku: { type: "string" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          precio: { type: "number", minimum: 0 },
        },
      },
    },
  },
};
