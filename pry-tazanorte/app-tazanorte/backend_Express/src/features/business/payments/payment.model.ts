import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/** Catálogos del pago (se validan en el service). */
export const PAYMENT_REFERENCE_TYPES = ["PEDIDO"] as const;
export const PAYMENT_METHODS = ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "NEQUI"] as const;
export const PAYMENT_STATES = ["PENDIENTE", "COMPLETADO", "CANCELADO"] as const;

export type PaymentReferenceType = (typeof PAYMENT_REFERENCE_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentState = (typeof PAYMENT_STATES)[number];

/**
 * Pago (tabla `payments`).
 * `referencia_tipo` + `referencia_id` identifican la operación pagada
 * (hoy solo `PEDIDO` -> `orders.id`).
 */
export interface PaymentI {
  id?: number;
  referencia_tipo: PaymentReferenceType;
  referencia_id: number;
  metodo: PaymentMethod;
  monto: number;
  fecha: Date | string;
  estado: PaymentState;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends Model {
  public id!: number;
  public referencia_tipo!: PaymentReferenceType;
  public referencia_id!: number;
  public metodo!: PaymentMethod;
  public monto!: number;
  public fecha!: Date;
  public estado!: PaymentState;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    referencia_tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0.01], msg: "monto must be > 0" } },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "PENDIENTE",
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
    modelName: "Payment",
    tableName: "payments",
    timestamps: true,
  }
);
