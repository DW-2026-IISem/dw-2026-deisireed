import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleUserModel } from './role-user.model';
import { ResourceModel } from './resource.model';
import { ResourceRoleModel } from './resource-role.model';

@Table({ tableName: 'roles', timestamps: true })
export class RoleModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string;

  @BelongsToMany(() => UserModel, () => RoleUserModel)
  declare users: UserModel[];

  @BelongsToMany(() => ResourceModel, () => ResourceRoleModel)
  declare resources: ResourceModel[];
}
