import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Status } from '../../../../../../common/enums/status.enum';

@Table({ tableName: 'pedidos' })
export class OrderModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(
    () =>
      require('../../../../clients/infrastructure/persistence/models/client.model')
        .ClientModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'cliente_id' })
  declare clienteId: number;

  @Column({ type: DataType.INTEGER, allowNull: true, field: 'origen_id' })
  declare origenId: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare canal: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare fecha: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'PENDING' })
  declare estado: string;

  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare status: Status;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
