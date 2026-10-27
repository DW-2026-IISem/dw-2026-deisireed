import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Insumo consumido por una línea de pedido (tabla `supply_order_items`).
 * N:M OrderItem <-> Supply: cuánto de cada insumo se usó al preparar un producto vendido.
 */
export interface SupplyOrderItemI {
  id?: number;
  pedido_detalle_id: number;
  insumo_id: number;
  cantidad_usada: number;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SupplyOrderItem extends Model {
  public id!: number;
  public pedido_detalle_id!: number;
  public insumo_id!: number;
  public cantidad_usada!: number;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SupplyOrderItem.init(
  {
    pedido_detalle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    insumo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad_usada: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0.01], msg: "cantidad_usada must be > 0" } },
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
    modelName: "SupplyOrderItem",
    tableName: "supply_order_items",
    timestamps: true,
    indexes: [
      // Un insumo aparece una sola vez por línea de pedido.
      { unique: true, name: "uq_supply_order_items_detalle_insumo", fields: ["pedido_detalle_id", "insumo_id"] },
    ],
  }
);
