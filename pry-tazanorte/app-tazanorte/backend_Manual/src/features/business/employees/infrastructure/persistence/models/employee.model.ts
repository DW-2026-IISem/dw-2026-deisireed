import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'empleados' })
export class EmployeeModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
}
