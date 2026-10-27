import { crudPaths } from "../../../shared/http/swagger-crud";

const clientIdParam = [
  {
    name: "id",
    in: "path",
    required: true,
    description: "id del **cliente** (> 0)",
    schema: { type: "integer", minimum: 1 },
  },
];

/**
 * Documentación OpenAPI del feature LoyaltyPoint (MovimientoPuntos).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 * Leyenda: todos los endpoints son **JWT + RBAC** (authenticate + authorize).
 *
 * Reglas: acumulación solo sobre pedidos pagados del mismo cliente (1 punto por
 * cada $1.000, una vez por pedido -> 409); redención limitada al saldo (400);
 * PUT/PATCH solo cambian `observaciones`; anular una acumulación ya redimida -> 409.
 */
export const loyaltyPointsSwagger = {
  tags: [
    {
      name: "PuntosFidelizacion",
      description:
        "Movimientos de puntos (acumulación / redención) y saldo por cliente — **JWT + RBAC**",
    },
  ],
  paths: {
    ...crudPaths({
      basePath: "/api/puntos-fidelizacion",
      tag: "PuntosFidelizacion",
      listKey: "loyalty_points",
      itemKey: "loyalty_point",
      schema: "LoyaltyPoint",
      uniqueField: "pedido (ya acumuló puntos)",
    }),
    "/api/puntos-fidelizacion/cliente/{id}/saldo": {
      get: {
        tags: ["PuntosFidelizacion"],
        summary: "Saldo de puntos de un cliente",
        description: "JWT + RBAC — Σ acumulaciones activas − Σ redenciones activas",
        parameters: clientIdParam,
        responses: {
          "200": {
            description: "Saldo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { balance: { $ref: "#/components/schemas/LoyaltyBalance" } },
                },
              },
            },
          },
          "400": { description: "id inválido o cliente inactivo" },
          "404": { description: "Cliente no encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      LoyaltyPoint: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          cliente_id: { type: "integer", example: 3 },
          pedido_id: { type: "integer", nullable: true, example: 5 },
          tipo: { type: "string", enum: ["acumulacion", "redencion"], example: "acumulacion" },
          cantidad: { type: "integer", example: 18 },
          fecha: { type: "string", format: "date-time" },
          observaciones: { type: "string", nullable: true, example: "Compra pedido #5" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LoyaltyPointCreate: {
        type: "object",
        required: ["cliente_id", "tipo"],
        description:
          "acumulacion: enviar `pedido_id` (la cantidad la calcula el backend). redencion: enviar `cantidad`.",
        properties: {
          cliente_id: { type: "integer", example: 3 },
          tipo: { type: "string", enum: ["acumulacion", "redencion"], example: "acumulacion" },
          pedido_id: { type: "integer", nullable: true, example: 5 },
          cantidad: { type: "integer", minimum: 1, example: 10 },
          observaciones: { type: "string", nullable: true, example: "Canje: café americano gratis" },
          is_active: { type: "boolean", default: true },
        },
      },
      LoyaltyPointUpdate: {
        type: "object",
        required: ["observaciones"],
        properties: { observaciones: { type: "string", nullable: true } },
      },
      LoyaltyPointPatch: {
        type: "object",
        properties: { observaciones: { type: "string", nullable: true } },
      },
      LoyaltyBalance: {
        type: "object",
        properties: {
          cliente_id: { type: "integer", example: 3 },
          acumulados: { type: "integer", example: 45 },
          redimidos: { type: "integer", example: 10 },
          saldo: { type: "integer", example: 35 },
        },
      },
    },
  },
};
