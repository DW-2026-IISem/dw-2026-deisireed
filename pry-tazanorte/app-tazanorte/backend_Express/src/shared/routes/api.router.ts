import { Router } from 'express';
import authRoutes from '../../features/auth/auth.routes';
import userRoutes from '../../features/users/user.routes';
import roleRoutes from '../../features/roles/role.routes';
import resourceRoutes from '../../features/resources/resource.routes';
import roleUserRoutes from '../../features/role-users/role-user.routes';
import resourceRoleRoutes from '../../features/resource-roles/resource-role.routes';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { authorizeResource } from '../middlewares/guard.middleware';

export const apiRouter = Router();

// Rutas públicas de Autenticación
apiRouter.use('/auth', authRoutes);

// Rutas protegidas por JWT y RBAC Guard
apiRouter.use('/users', authenticateJwt, authorizeResource, userRoutes);
apiRouter.use('/roles', authenticateJwt, authorizeResource, roleRoutes);
apiRouter.use('/resources', authenticateJwt, authorizeResource, resourceRoutes);
apiRouter.use('/role-users', authenticateJwt, authorizeResource, roleUserRoutes);
apiRouter.use('/resource-roles', authenticateJwt, authorizeResource, resourceRoleRoutes);
