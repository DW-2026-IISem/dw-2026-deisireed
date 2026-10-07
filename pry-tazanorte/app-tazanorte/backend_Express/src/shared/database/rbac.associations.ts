import { UserModel } from './models/user.model';
import { RoleModel } from './models/role.model';
import { ResourceModel } from './models/resource.model';
import { RoleUserModel } from './models/role-user.model';
import { ResourceRoleModel } from './models/resource-role.model';
import { RefreshTokenModel } from './models/refresh-token.model';

export function setupRbacAssociations(): void {
  UserModel.belongsToMany(RoleModel, { through: RoleUserModel, foreignKey: 'user_id', otherKey: 'role_id' });
  RoleModel.belongsToMany(UserModel, { through: RoleUserModel, foreignKey: 'role_id', otherKey: 'user_id' });

  RoleModel.belongsToMany(ResourceModel, { through: ResourceRoleModel, foreignKey: 'role_id', otherKey: 'resource_id' });
  ResourceModel.belongsToMany(RoleModel, { through: ResourceRoleModel, foreignKey: 'resource_id', otherKey: 'role_id' });

  UserModel.hasMany(RefreshTokenModel, { foreignKey: 'user_id' });
  RefreshTokenModel.belongsTo(UserModel, { foreignKey: 'user_id' });
}
