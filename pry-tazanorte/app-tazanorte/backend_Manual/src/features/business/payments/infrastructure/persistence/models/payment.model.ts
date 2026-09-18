import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'pagos' })
export class PaymentModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
}
