import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TazaNorte - Cafetería y Fidelización',
      version: '1.0.0',
      description: 'Documentación Oficial Completa - Módulos de Negocio y Seguridad RBAC',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        docExpansion: 'list', // Mantiene todas las secciones y tablas abiertas
        filter: true,
      },
    })
  );
};
