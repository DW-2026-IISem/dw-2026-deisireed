import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API TazaNorte - Cafetería y Fidelización",
      version: "1.0.0",
      description: "Documentación unificada de endpoints de la API TazaNorte",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor Local",
      },
    ],
    tags: [
      { name: "Clientes", description: "Gestión de clientes (ISS-01/02)" },
      { name: "Productos", description: "Gestión de productos y categorías (ISS-03/04)" },
      { name: "Empleados", description: "Gestión de empleados y roles (ISS-05/06)" },
      { name: "Insumos", description: "Gestión de insumos e inventario (ISS-07)" },
      { name: "Cajas", description: "Gestión de cajas registradoras (ISS-08)" },
      { name: "Pedidos", description: "Gestión de pedidos (ISS-09)" },
      { name: "DetallesPedido", description: "Detalles de ítems por pedido (ISS-10)" },
      { name: "SupplyOrderItems", description: "Gestión de insumos por detalle de pedido (ISS-11)" },
      { name: "Pagos", description: "Gestión de pagos (ISS-12)" },
    ],
  },
  apis: [
    "./src/**/*.swagger.ts",
    "./src/**/*.ts",
    "./dist/**/*.swagger.js",
    "./dist/**/*.js"
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
