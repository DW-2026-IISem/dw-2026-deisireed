import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Status } from '../../../../../../common/enums/status.enum';

@Table({ tableName: 'movimientopuntos' })
export class PointsMovementModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare referencia_id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tipo: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare fecha: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare cantidad: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare observaciones: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare estado: Status;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
