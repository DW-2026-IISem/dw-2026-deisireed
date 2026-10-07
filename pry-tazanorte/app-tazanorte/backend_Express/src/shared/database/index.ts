import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/user.model';
import { RoleModel } from './models/role.model';
import { ResourceModel } from './models/resource.model';
import { RoleUserModel } from './models/role-user.model';
import { ResourceRoleModel } from './models/resource-role.model';
import { RefreshTokenModel } from './models/refresh-token.model';
import { setupRbacAssociations } from './rbac.associations';

export const authModels = [
  UserModel,
  RoleModel,
  ResourceModel,
  RoleUserModel,
  ResourceRoleModel,
  RefreshTokenModel,
];

// Ejecutar asociaciones explícitas
setupRbacAssociations();
