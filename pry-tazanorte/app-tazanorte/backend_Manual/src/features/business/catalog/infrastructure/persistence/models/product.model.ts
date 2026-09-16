import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class ProductModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(50), unique: true, allowNull: false })
  declare sku: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
}
