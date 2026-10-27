import { crudPaths } from "../../../shared/http/swagger-crud";

/**
 * Documentación OpenAPI del feature Payment (Pago).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 * Leyenda: todos los endpoints son **JWT + RBAC** (authenticate + authorize).
 *
 * Reglas extra: `referencia_id` debe ser un pedido existente (404) no cancelado (400).
 */
export const paymentsSwagger = {
  tags: [
    {
      name: "Pagos",
      description: "CRUD de pagos — **JWT + RBAC** (referencia_id = pedido no cancelado)",
    },
  ],
  paths: crudPaths({
    basePath: "/api/pagos",
    tag: "Pagos",
    listKey: "payments",
    itemKey: "payment",
    schema: "Payment",
  }),
  components: {
    schemas: {
      Payment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          referencia_tipo: { type: "string", enum: ["PEDIDO"], example: "PEDIDO" },
          referencia_id: { type: "integer", example: 3 },
          metodo: { type: "string", enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "NEQUI"], example: "NEQUI" },
          monto: { type: "number", example: 18500 },
          fecha: { type: "string", format: "date-time" },
          estado: { type: "string", enum: ["PENDIENTE", "COMPLETADO", "CANCELADO"], example: "COMPLETADO" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaymentCreate: {
        type: "object",
        required: ["referencia_tipo", "referencia_id", "metodo", "monto"],
        properties: {
          referencia_tipo: { type: "string", enum: ["PEDIDO"], example: "PEDIDO" },
          referencia_id: { type: "integer", example: 3 },
          metodo: { type: "string", enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "NEQUI"], example: "EFECTIVO" },
          monto: { type: "number", minimum: 0.01, example: 18500 },
          fecha: { type: "string", format: "date-time" },
          estado: { type: "string", enum: ["PENDIENTE", "COMPLETADO", "CANCELADO"], default: "PENDIENTE" },
          is_active: { type: "boolean", default: true },
        },
      },
      PaymentUpdate: {
        type: "object",
        required: ["referencia_tipo", "referencia_id", "metodo", "monto", "fecha", "estado"],
        properties: {
          referencia_tipo: { type: "string", enum: ["PEDIDO"] },
          referencia_id: { type: "integer" },
          metodo: { type: "string", enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "NEQUI"] },
          monto: { type: "number", minimum: 0.01 },
          fecha: { type: "string", format: "date-time" },
          estado: { type: "string", enum: ["PENDIENTE", "COMPLETADO", "CANCELADO"] },
        },
      },
      PaymentPatch: {
        type: "object",
        properties: {
          metodo: { type: "string", enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "NEQUI"] },
          monto: { type: "number", minimum: 0.01 },
          estado: { type: "string", enum: ["PENDIENTE", "COMPLETADO", "CANCELADO"], example: "COMPLETADO" },
        },
      },
    },
  },
};
