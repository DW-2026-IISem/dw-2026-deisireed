import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Status } from '../../../../../../common/enums/status.enum';

@Table({ tableName: 'sales' })
export class SaleModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare saleDate: Date;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
  declare tax: number;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
  declare discounts: number;

  @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
  declare total: number;

  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare status: Status;

  @ForeignKey(
    () =>
      require('../../../../clients/infrastructure/persistence/models/client.model')
        .ClientModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare clientId: number;

  @BelongsTo(
    () =>
      require('../../../../clients/infrastructure/persistence/models/client.model')
        .ClientModel,
  )
  declare client: unknown;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(
    () =>
      require('./product-sale.model').ProductSaleModel,
  )
  declare items: unknown[];
}
