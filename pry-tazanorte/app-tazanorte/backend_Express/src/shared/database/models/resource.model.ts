import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { ResourceRoleModel } from './resource-role.model';

@Table({ tableName: 'resources', timestamps: true })
export class ResourceModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(10), allowNull: false })
  declare method: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare path: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string;

  @BelongsToMany(() => RoleModel, () => ResourceRoleModel)
  declare roles: RoleModel[];
}
