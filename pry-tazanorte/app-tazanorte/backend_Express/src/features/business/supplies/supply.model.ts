import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface SupplyI {
  id?: number;
  codigo: string;
  nombre: string;
  unidad_medida: string;
  stock_minimo: number;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Supply extends Model {
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public unidad_medida!: string;
  public stock_minimo!: number;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Supply.init(
  {
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "codigo cannot be empty" } },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "nombre cannot be empty" } },
    },
    unidad_medida: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { notEmpty: { msg: "unidad_medida cannot be empty" } },
    },
    stock_minimo: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: "stock_minimo must be >= 0" } },
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
    modelName: "Supply",
    tableName: "supplies",
    timestamps: true,
  }
);
