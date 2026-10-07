import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';

@Table({ tableName: 'role_users', timestamps: false })
export class RoleUserModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare role_id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare user_id: string;
}
