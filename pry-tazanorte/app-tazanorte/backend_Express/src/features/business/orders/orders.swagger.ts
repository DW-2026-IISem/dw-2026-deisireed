/**
 * Documentación OpenAPI del feature Order (tabla orders).
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

const orderEnvelope = {
  type: "object",
  properties: { order: { $ref: "#/components/schemas/Order" } },
};

export const ordersSwagger = {
  tags: [
    {
      name: "Pedidos",
      description: "CRUD de pedidos (cabecera + líneas) y cambio de estado — **SIN AUTH**",
    },
  ],
  paths: {
    "/api/pedidos": {
      get: {
        tags: ["Pedidos"],
        summary: "Listar pedidos (no cancelados) con sus líneas",
        description: "SIN AUTH — retorna pedidos con estado distinto de 'cancelado'",
        responses: {
          "200": {
            description: "Lista de pedidos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    orders: { type: "array", items: { $ref: "#/components/schemas/Order" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Pedidos"],
        summary: "Crear pedido (cabecera + líneas, transaccional)",
        description:
          "SIN AUTH — valida cliente, turno de caja y productos activos; calcula subtotal/total; estado inicial 'pendiente'",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrderCreate" } } },
        },
        responses: {
          "201": {
            description: "Pedido creado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/OrderCreateResult" } },
            },
          },
          "400": { description: "Validación (sin líneas, canal, cantidad, cliente/turno/producto inactivo)" },
          "404": { description: "Cliente, turno de caja o producto no encontrado" },
        },
      },
    },
    "/api/pedidos/{id}": {
      get: {
        tags: ["Pedidos"],
        summary: "Obtener pedido por id (con líneas)",
        description: "SIN AUTH — 404 si no existe o está cancelado",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Pedido encontrado",
            content: { "application/json": { schema: orderEnvelope } },
          },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Pedidos"],
        summary: "Actualizar cabecera (PUT)",
        description: "SIN AUTH — solo pedidos 'pendiente'; canal obligatorio",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrderUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado", content: { "application/json": { schema: orderEnvelope } } },
          "400": { description: "id inválido, canal inválido o pedido no pendiente" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Pedidos"],
        summary: "Actualizar cabecera (PATCH — parcial)",
        description: "SIN AUTH — solo pedidos 'pendiente'",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrderPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado", content: { "application/json": { schema: orderEnvelope } } },
          "400": { description: "id inválido o pedido no pendiente" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Pedidos"],
        summary: "Eliminar pedido (físico)",
        description: "SIN AUTH — solo pedidos 'pendiente' o 'cancelado'; borra también sus líneas",
        parameters: [idParam],
        responses: {
          "200": { description: "Eliminado" },
          "400": { description: "id inválido o estado que no permite borrado físico" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/pedidos/{id}/estado": {
      patch: {
        tags: ["Pedidos"],
        summary: "Cambiar estado del pedido",
        description:
          "SIN AUTH — pendiente → pagado | cancelado; pagado → en_preparacion | entregado | cancelado; en_preparacion → entregado | cancelado. Para pagar necesita al menos una línea activa.",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrderStateUpdate" } } },
        },
        responses: {
          "200": { description: "Estado actualizado", content: { "application/json": { schema: orderEnvelope } } },
          "400": { description: "id inválido, estado inválido o transición no permitida" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/pedidos/{id}/deactivate": {
      patch: {
        tags: ["Pedidos"],
        summary: "Cancelar pedido (lógico)",
        description: "SIN AUTH — estado = 'cancelado' y desactiva sus líneas",
        parameters: [idParam],
        responses: {
          "200": { description: "Cancelado" },
          "400": { description: "id inválido o transición no permitida (p. ej. ya entregado)" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Order: {
        type: "object",
        description: "Pedido (tabla orders). subtotal/total son derivados de las líneas activas.",
        properties: {
          id: { type: "integer", example: 1 },
          cliente_id: { type: "integer", example: 1 },
          turno_caja_id: { type: "integer", example: 1 },
          canal: { type: "string", enum: ["caja", "para_llevar"], example: "caja" },
          fecha: { type: "string", format: "date-time" },
          subtotal: { type: "number", example: 13500.0 },
          total: { type: "number", example: 13500.0 },
          estado: {
            type: "string",
            enum: ["pendiente", "pagado", "en_preparacion", "entregado", "cancelado"],
            example: "pendiente",
          },
          items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      OrderLineInput: {
        type: "object",
        required: ["producto_id", "cantidad"],
        properties: {
          producto_id: { type: "integer" },
          cantidad: { type: "integer", minimum: 1 },
          observaciones: { type: "string", nullable: true },
        },
      },
      OrderCreate: {
        type: "object",
        required: ["cliente_id", "turno_caja_id", "items"],
        properties: {
          cliente_id: { type: "integer" },
          turno_caja_id: { type: "integer" },
          canal: { type: "string", enum: ["caja", "para_llevar"], default: "caja" },
          fecha: { type: "string", format: "date-time" },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/OrderLineInput" },
          },
        },
      },
      OrderCreateResult: {
        type: "object",
        properties: {
          order: { $ref: "#/components/schemas/Order" },
          items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
        },
      },
      OrderUpdate: {
        type: "object",
        required: ["canal"],
        properties: {
          cliente_id: { type: "integer" },
          turno_caja_id: { type: "integer" },
          canal: { type: "string", enum: ["caja", "para_llevar"] },
          fecha: { type: "string", format: "date-time" },
        },
      },
      OrderPatch: {
        type: "object",
        properties: {
          cliente_id: { type: "integer" },
          turno_caja_id: { type: "integer" },
          canal: { type: "string", enum: ["caja", "para_llevar"] },
          fecha: { type: "string", format: "date-time" },
        },
      },
      OrderStateUpdate: {
        type: "object",
        required: ["estado"],
        properties: {
          estado: {
            type: "string",
            enum: ["pendiente", "pagado", "en_preparacion", "entregado", "cancelado"],
          },
        },
      },
    },
  },
};
