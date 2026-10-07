import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CashRegisterI {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  empleado_id: number;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CashRegister extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public empleado_id!: number;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CashRegister.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "nombre cannot be empty" } },
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    empleado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "CashRegister",
    tableName: "cash_registers",
    timestamps: true,
  }
);
