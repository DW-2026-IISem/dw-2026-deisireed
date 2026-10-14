import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { ResourceModel } from './resource.model';
import { RoleModel } from './role.model';

@Table({ tableName: 'resource_roles', timestamps: false })
export class ResourceRoleModel extends Model {
  @ForeignKey(() => ResourceModel)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare resource_id: string;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID, primaryKey: true })
  declare role_id: string;
}
