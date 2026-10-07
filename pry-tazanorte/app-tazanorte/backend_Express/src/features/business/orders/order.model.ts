import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type OrderChannel = "caja" | "para_llevar";
export type OrderState = "pendiente" | "pagado" | "en_preparacion" | "entregado" | "cancelado";

export interface OrderI {
  id?: number;
  cliente_id: number;
  turno_caja_id: number;
  canal: OrderChannel;
  fecha: Date | string;
  subtotal: number;
  total: number;
  estado: OrderState;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order extends Model {
  public id!: number;
  public cliente_id!: number;
  public turno_caja_id!: number;
  public canal!: OrderChannel;
  public fecha!: Date;
  public subtotal!: number;
  public total!: number;
  public estado!: OrderState;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    turno_caja_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    canal: {
      type: DataTypes.ENUM("caja", "para_llevar"),
      allowNull: false,
      defaultValue: "caja",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "pagado", "en_preparacion", "entregado", "cancelado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  }
);
