import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type LoyaltyMovementType = "acumulacion" | "redencion";

/** Regla de acumulación: 1 punto por cada $1.000 del total del pedido. */
export const PESOS_PER_POINT = 1000;

/** Pedidos que ya cuentan como venta pagada (pueden acumular puntos). */
export const ORDER_STATES_THAT_EARN = ["pagado", "en_preparacion", "entregado"] as const;

/**
 * Movimiento de puntos de fidelización (tabla `loyalty_points`).
 *
 * Historial de acumulaciones y redenciones por cliente. El saldo no se guarda:
 * se calcula como Σ acumulaciones activas − Σ redenciones activas.
 */
export interface LoyaltyPointI {
  id?: number;
  cliente_id: number;
  pedido_id?: number | null;
  tipo: LoyaltyMovementType;
  cantidad: number;
  fecha: Date | string;
  observaciones?: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LoyaltyPoint extends Model {
  public id!: number;
  public cliente_id!: number;
  public pedido_id!: number | null;
  public tipo!: LoyaltyMovementType;
  public cantidad!: number;
  public fecha!: Date;
  public observaciones!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LoyaltyPoint.init(
  {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pedido_id: {
      // Obligatorio en acumulaciones (el pedido que las origina); null en redenciones.
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM("acumulacion", "redencion"),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: "cantidad must be >= 1" } },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    modelName: "LoyaltyPoint",
    tableName: "loyalty_points",
    timestamps: true,
  }
);
