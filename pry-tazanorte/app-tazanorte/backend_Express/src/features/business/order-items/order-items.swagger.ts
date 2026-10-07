/**
 * Documentación OpenAPI del feature OrderItem (tabla order_items).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: todos los endpoints son **SIN AUTH**.
 */

const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "id numérico (> 0). Si no lo es, la API responde 400.",
  schema: { type: "integer", minimum: 1 },
};

const itemEnvelope = {
  type: "object",
  properties: { order_item: { $ref: "#/components/schemas/OrderItem" } },
};

export const orderItemsSwagger = {
  tags: [
    {
      name: "DetallePedidos",
      description: "CRUD de líneas Pedido↔Producto (tabla order_items) — **SIN AUTH**",
    },
  ],
  paths: {
    "/api/detalle-pedidos": {
      get: {
        tags: ["DetallePedidos"],
        summary: "Listar líneas de pedido activas",
        description: "SIN AUTH — retorna order_items con is_active=true",
        responses: {
          "200": {
            description: "Lista de líneas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    order_items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/OrderItem" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["DetallePedidos"],
        summary: "Agregar línea a un pedido",
        description:
          "SIN AUTH — el pedido debe estar 'pendiente' y el producto activo; guarda el precio como snapshot y recalcula los totales del pedido",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/OrderItemCreate" } },
          },
        },
        responses: {
          "201": {
            description: "Línea creada",
            content: { "application/json": { schema: itemEnvelope } },
          },
          "400": { description: "Validación (cantidad, producto inactivo o pedido no pendiente)" },
          "404": { description: "Pedido o producto no encontrado" },
        },
      },
    },
    "/api/detalle-pedidos/{id}": {
      get: {
        tags: ["DetallePedidos"],
        summary: "Obtener línea por id",
        description: "SIN AUTH — 404 si no existe o tiene borrado lógico",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Línea encontrada",
            content: { "application/json": { schema: itemEnvelope } },
          },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["DetallePedidos"],
        summary: "Actualizar línea (PUT)",
        description: "SIN AUTH — reemplaza cantidad y observaciones; recalcula el pedido",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/OrderItemUpdate" } },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "400": { description: "id inválido, cantidad inválida o pedido no pendiente" },
          "404": { description: "No encontrada" },
        },
      },
      patch: {
        tags: ["DetallePedidos"],
        summary: "Actualizar línea (PATCH — parcial)",
        description: "SIN AUTH — cantidad y/o observaciones",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/OrderItemPatch" } },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "400": { description: "id inválido o pedido no pendiente" },
          "404": { description: "No encontrada" },
        },
      },
      delete: {
        tags: ["DetallePedidos"],
        summary: "Eliminar línea (físico)",
        description: "SIN AUTH — recalcula el pedido (también si tiene borrado lógico)",
        parameters: [idParam],
        responses: {
          "200": { description: "Eliminada" },
          "400": { description: "id inválido o pedido no pendiente" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/detalle-pedidos/{id}/deactivate": {
      patch: {
        tags: ["DetallePedidos"],
        summary: "Eliminar línea (lógico)",
        description: "SIN AUTH — is_active = false y recalcula el pedido",
        parameters: [idParam],
        responses: {
          "200": { description: "Desactivada" },
          "400": { description: "id inválido o pedido no pendiente" },
          "404": { description: "No encontrada" },
        },
      },
    },
  },
  components: {
    schemas: {
      OrderItem: {
        type: "object",
        description:
          "Detalle N:M Pedido↔Producto. valor_unitario = snapshot del precio; total = cantidad × valor_unitario",
        properties: {
          id: { type: "integer", example: 1 },
          pedido_id: { type: "integer", example: 1 },
          producto_id: { type: "integer", example: 1 },
          cantidad: { type: "integer", example: 2 },
          valor_unitario: { type: "number", example: 4500.0 },
          total: { type: "number", example: 9000.0 },
          observaciones: { type: "string", nullable: true, example: "Sin azúcar" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      OrderItemCreate: {
        type: "object",
        required: ["pedido_id", "producto_id", "cantidad"],
        properties: {
          pedido_id: { type: "integer" },
          producto_id: { type: "integer" },
          cantidad: { type: "integer", minimum: 1 },
          observaciones: { type: "string", nullable: true },
          is_active: { type: "boolean", default: true },
        },
      },
      OrderItemUpdate: {
        type: "object",
        required: ["cantidad"],
        properties: {
          cantidad: { type: "integer", minimum: 1 },
          observaciones: { type: "string", nullable: true },
        },
      },
      OrderItemPatch: {
        type: "object",
        properties: {
          cantidad: { type: "integer", minimum: 1 },
          observaciones: { type: "string", nullable: true },
        },
      },
    },
  },
};
