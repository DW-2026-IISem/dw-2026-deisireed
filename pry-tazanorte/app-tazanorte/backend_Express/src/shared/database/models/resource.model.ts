import { Table, Column, Model, DataType } from 'sequelize-typescript';

/**
 * @openapi
 * components:
 *   schemas:
 *     Recurso:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         path:
 *           type: string
 *         method:
 *           type: string
 *         module:
 *           type: string
 */
@Table({ tableName: 'resources', timestamps: true })
export class ResourceModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare path: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare method: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare module: string;
}
