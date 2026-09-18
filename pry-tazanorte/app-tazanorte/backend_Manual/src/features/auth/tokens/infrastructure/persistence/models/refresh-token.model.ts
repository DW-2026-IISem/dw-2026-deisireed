import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'refresh_tokens' })
export class RefreshTokenModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
}
