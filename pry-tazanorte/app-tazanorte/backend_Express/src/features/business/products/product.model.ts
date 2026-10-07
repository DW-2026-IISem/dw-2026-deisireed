import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ProductI {
  id?: number;
  sku: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Model {
  public id!: number;
  public sku!: string;
  public nombre!: string;
  public descripcion!: string | null;
  public precio!: number;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "sku cannot be empty" } },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "nombre cannot be empty" } },
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "precio must be >= 0" } },
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
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);
