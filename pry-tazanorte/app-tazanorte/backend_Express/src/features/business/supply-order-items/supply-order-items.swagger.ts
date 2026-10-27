import { crudPaths } from "../../../shared/http/swagger-crud";

/**
 * Documentación OpenAPI del feature SupplyOrderItem (InsumoPedidoDetalle).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 * Leyenda: todos los endpoints son **JWT + RBAC** (authenticate + authorize).
 *
 * Reglas extra: línea de pedido e insumo deben existir (404) y estar activos (400);
 * el par (pedido_detalle_id, insumo_id) es único (409).
 */
export const supplyOrderItemsSwagger = {
  tags: [
    {
      name: "InsumosPedidoDetalle",
      description: "Insumos consumidos por cada línea de pedido — **JWT + RBAC**",
    },
  ],
  paths: crudPaths({
    basePath: "/api/insumo-pedido-detalles",
    tag: "InsumosPedidoDetalle",
    listKey: "supply_order_items",
    itemKey: "supply_order_item",
    schema: "SupplyOrderItem",
    uniqueField: "par (pedido_detalle_id, insumo_id)",
  }),
  components: {
    schemas: {
      SupplyOrderItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pedido_detalle_id: { type: "integer", example: 4 },
          insumo_id: { type: "integer", example: 2 },
          cantidad_usada: { type: "number", example: 0.25 },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SupplyOrderItemCreate: {
        type: "object",
        required: ["pedido_detalle_id", "insumo_id", "cantidad_usada"],
        properties: {
          pedido_detalle_id: { type: "integer", example: 4 },
          insumo_id: { type: "integer", example: 2 },
          cantidad_usada: { type: "number", minimum: 0.01, example: 0.25 },
          is_active: { type: "boolean", default: true },
        },
      },
      SupplyOrderItemUpdate: {
        type: "object",
        required: ["pedido_detalle_id", "insumo_id", "cantidad_usada"],
        properties: {
          pedido_detalle_id: { type: "integer" },
          insumo_id: { type: "integer" },
          cantidad_usada: { type: "number", minimum: 0.01 },
        },
      },
      SupplyOrderItemPatch: {
        type: "object",
        properties: {
          cantidad_usada: { type: "number", minimum: 0.01, example: 0.3 },
        },
      },
    },
  },
};
