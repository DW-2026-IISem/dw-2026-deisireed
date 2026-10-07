import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../../database/db";

export interface SupplyOrderItemI {
  id?: number;
  orderItemId: number;
  supplyId: number;
  quantityUsed: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SupplyOrderItem extends Model<SupplyOrderItemI> implements SupplyOrderItemI {
  public id!: number;
  public orderItemId!: number;
  public supplyId!: number;
  public quantityUsed!: number;
}

SupplyOrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supplyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantityUsed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "supply_order_items",
    timestamps: true,
  }
);
