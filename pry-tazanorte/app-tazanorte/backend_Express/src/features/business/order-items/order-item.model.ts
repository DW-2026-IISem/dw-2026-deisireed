import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Detalle N:M Order <-> Product (tabla `order_items`).
 * `valor_unitario` = snapshot del precio al vender; `total` = cantidad × valor_unitario.
 */
export interface OrderItemI {
  id?: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  valor_unitario: number;
  total: number;
  observaciones?: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OrderItem extends Model {
  public id!: number;
  public pedido_id!: number;
  public producto_id!: number;
  public cantidad!: number;
  public valor_unitario!: number;
  public total!: number;
  public observaciones!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: "cantidad must be >= 1" } },
    },
    valor_unitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      // Fail-safe: una fila insertada sin estado explícito NO queda visible en la API.
      // La vía de creación de la API siempre envía true.
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
  }
);
