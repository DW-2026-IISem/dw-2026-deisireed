import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Modelos Auth / RBAC
import { UserModel } from './models/user.model';
import { RoleModel } from './models/role.model';
import { ResourceModel } from './models/resource.model';
import { RoleUserModel } from './models/role-user.model';
import { ResourceRoleModel } from './models/resource-role.model';
import { RefreshTokenModel } from './models/refresh-token.model';

import { setupRbacAssociations } from './rbac.associations';

dotenv.config();

export const authModels = [
  UserModel,
  RoleModel,
  ResourceModel,
  RoleUserModel,
  ResourceRoleModel,
  RefreshTokenModel,
];

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tazanorte_db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: authModels,
});

setupRbacAssociations();

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos MySQL establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    throw error;
  }
};
