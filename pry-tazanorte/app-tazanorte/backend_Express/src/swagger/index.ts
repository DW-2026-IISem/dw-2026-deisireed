import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { clientsSwagger } from "../features/business/clients/clients.swagger";
import { productsSwagger } from "../features/business/products/products.swagger";
import { employeesSwagger } from "../features/business/employees/employees.swagger";
import { suppliesSwagger } from "../features/business/supplies/supplies.swagger";
import { cashRegistersSwagger } from "../features/business/cash-registers/cash-registers.swagger";
import { orderItemsSwagger } from "../features/business/order-items/order-items.swagger";
import { supplyOrderItemsSwagger } from "../features/business/supply-order-items/supply-order-items.swagger";
import { paymentsSwagger } from "../features/business/payments/payments.swagger";
import { loyaltyPointsSwagger } from "../features/business/loyalty-points/loyalty-points.swagger";
import { usersSwagger } from "../features/auth/users/users.swagger";
import { rolesSwagger } from "../features/auth/roles/roles.swagger";
import { resourcesSwagger } from "../features/auth/resources/resources.swagger";
import { roleUsersSwagger } from "../features/auth/role-users/role-users.swagger";
import { resourceRolesSwagger } from "../features/auth/resource-roles/resource-roles.swagger";
import { refreshTokensSwagger } from "../features/auth/refresh-tokens/refresh-tokens.swagger";
import { sessionSwagger } from "../features/auth/session/session.swagger";
import { bearerSecurityScheme } from "../shared/http/swagger-security";
import { ordersSwagger } from "../features/business/orders/orders.swagger";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  clientsSwagger,
  productsSwagger,
  employeesSwagger,
  suppliesSwagger,
  cashRegistersSwagger,
  orderItemsSwagger,
  supplyOrderItemsSwagger,
  paymentsSwagger,
  loyaltyPointsSwagger,
  // Fase II — Auth con RBAC
  sessionSwagger,
  usersSwagger,
  rolesSwagger,
  resourcesSwagger,
  roleUsersSwagger,
  resourceRolesSwagger,
  refreshTokensSwagger,
  ordersSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "TazaNorte API",
      version: "1.0.0",
      description:
        "API TazaNorte — cafetería y fidelización (Express + Sequelize) con **Auth con RBAC**. Modalidades: **OPEN** (login, refresh, logout), **JWT** (perfil y sesiones) y **JWT + RBAC** (todo el CRUD de negocio y de seguridad). Obtén el `access_token` en `POST /api/sesion/login` y pulsa **Authorize**. Deny by default: sin concesión, 403. Usuarios de laboratorio: admin / Admin123!, caja / Caja123!, barista / Barista123!, bodega / Bodega123!, supervisor / Supervisor123!.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    // Secure by default: toda operación exige el access token salvo que declare `security: []`.
    security: [{ bearerAuth: [] }],
    components: {
      // Esquema `bearerAuth` (Authorization: Bearer <token>) para el botón Authorize.
      securitySchemes: bearerSecurityScheme,
      schemas,
    },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
