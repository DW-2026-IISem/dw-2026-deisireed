import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'recetainsumo' })
export class RecipeModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
}
