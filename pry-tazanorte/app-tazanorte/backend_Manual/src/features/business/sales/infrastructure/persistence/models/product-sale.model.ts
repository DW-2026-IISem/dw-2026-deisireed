import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'product_sales' })
export class ProductSaleModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  declare total: number;

  @ForeignKey(
    () =>
      require('../../../../products/infrastructure/persistence/models/product.model')
        .ProductModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare productId: number;

  @BelongsTo(
    () =>
      require('../../../../products/infrastructure/persistence/models/product.model')
        .ProductModel,
  )
  declare product: unknown;

  @ForeignKey(() => require('./sale.model').SaleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare saleId: number;

  @BelongsTo(() => require('./sale.model').SaleModel)
  declare sale: unknown;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare quantity: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  declare unitPrice: number;
}
