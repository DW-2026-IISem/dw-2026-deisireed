import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './shared/database';
import { apiRouter } from './shared/routes/api.router';
import { swaggerSpec } from './shared/config/swagger.config';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Endpoint
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Registrar Router Principal
app.use('/api', apiRouter);

// Inicialización del servidor y base de datos
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`📍 Endpoint base: http://localhost:${PORT}/api`);
      console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
