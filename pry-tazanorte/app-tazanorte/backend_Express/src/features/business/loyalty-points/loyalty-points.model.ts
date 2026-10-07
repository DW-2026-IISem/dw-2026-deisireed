import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../../database/db";

export class LoyaltyPoints extends Model {
  public id!: number;
  public clientId!: number;
  public points!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LoyaltyPoints.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "loyalty_points",
    sequelize,
    timestamps: true,
  }
);
