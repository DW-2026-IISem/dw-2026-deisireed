import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { RoleUserModel } from './role-user.model';
import { RefreshTokenModel } from './refresh-token.model';

@Table({ tableName: 'users', timestamps: true })
export class UserModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password_hash: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;

  @BelongsToMany(() => RoleModel, () => RoleUserModel)
  declare roles: RoleModel[];

  @HasMany(() => RefreshTokenModel)
  declare refresh_tokens: RefreshTokenModel[];
}
