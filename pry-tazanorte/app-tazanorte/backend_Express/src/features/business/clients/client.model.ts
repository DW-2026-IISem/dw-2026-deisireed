import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ClientI {
  id?: number;
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Client extends Model {
  public id!: number;
  public tipo_documento!: string;
  public numero_documento!: string;
  public nombre!: string;
  public telefono!: string | null;
  public email!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    tipo_documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { notEmpty: { msg: "tipo_documento cannot be empty" } },
    },
    numero_documento: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "numero_documento cannot be empty" } },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "nombre cannot be empty" } },
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: { msg: "Email must be a valid email address" } },
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
    modelName: "Client",
    tableName: "clients",
    timestamps: true,
  }
);
