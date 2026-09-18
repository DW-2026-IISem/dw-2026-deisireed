import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'movimientopuntos' })
export class PointsMovementModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
}
