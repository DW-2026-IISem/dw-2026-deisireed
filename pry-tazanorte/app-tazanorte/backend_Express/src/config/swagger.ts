import swaggerJSDoc from "swagger-jsdoc";
import { cashRegistersSwagger } from "../features/business/cash-registers/cash-registers.swagger";
import { employeesSwagger } from "../features/business/employees/employees.swagger";
import { suppliesSwagger } from "../features/business/supplies/supplies.swagger";

// Cargar otros módulos si exportan objetos similares (o importar dinámicamente)
import * as clientsSwaggerModule from "../features/business/clients/clients.swagger";
import * as ordersSwaggerModule from "../features/business/orders/orders.swagger";
import * as orderItemsSwaggerModule from "../features/business/order-items/order-items.swagger";
import * as productsSwaggerModule from "../features/business/products/products.swagger";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TazaNorte API",
      version: "1.0.0",
      description: "Documentación de la API de TazaNorte",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor Local",
      },
    ],
  },
  apis: [
    "./src/features/**/*.swagger.ts",
    "./src/features/**/*.routes.ts",
  ],
};

const baseSpec = swaggerJSDoc(options) as any;

// Función para fusionar paths y tags de objetos exportados
const mergeSwaggerObj = (swaggerObj: any) => {
  if (!swaggerObj) return;
  if (swaggerObj.tags) {
    baseSpec.tags = [...(baseSpec.tags || []), ...swaggerObj.tags];
  }
  if (swaggerObj.paths) {
    baseSpec.paths = { ...(baseSpec.paths || {}), ...swaggerObj.paths };
  }
  if (swaggerObj.components) {
    baseSpec.components = {
      ...baseSpec.components,
      schemas: {
        ...(baseSpec.components?.schemas || {}),
        ...(swaggerObj.components?.schemas || {}),
      },
    };
  }
};

// Fusionar los objetos de Swagger de tus módulos existentes
mergeSwaggerObj(cashRegistersSwagger);
mergeSwaggerObj(employeesSwagger);
mergeSwaggerObj(suppliesSwagger);

// Fusionar exportaciones por defecto/nombradas de los demás módulos si existen
[clientsSwaggerModule, ordersSwaggerModule, orderItemsSwaggerModule, productsSwaggerModule].forEach((mod: any) => {
  Object.keys(mod).forEach((key) => {
    if (typeof mod[key] === "object" && (mod[key].paths || mod[key].tags)) {
      mergeSwaggerObj(mod[key]);
    }
  });
});

export const swaggerSpec = baseSpec;
