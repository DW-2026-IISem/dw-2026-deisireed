import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({ tableName: 'refresh_tokens', timestamps: true })
export class RefreshTokenModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare token_hash: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare expires_at: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_revoked: boolean;

  @BelongsTo(() => UserModel)
  declare user: UserModel;
}
