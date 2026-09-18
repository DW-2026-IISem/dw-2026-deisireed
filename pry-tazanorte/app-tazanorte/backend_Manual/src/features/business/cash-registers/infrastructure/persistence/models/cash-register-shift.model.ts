import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'turnocaja' })
export class CashRegisterShiftModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
}
