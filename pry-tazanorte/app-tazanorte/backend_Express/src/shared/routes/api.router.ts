import { Router } from 'express';
import authRoutes from '../../features/auth/auth.routes';
import userRoutes from '../../features/users/user.routes';

export const apiRouter = Router();

// Módulos de Seguridad & RBAC
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/usuarios', userRoutes);
