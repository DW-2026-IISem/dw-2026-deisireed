import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface EmployeeI {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Employee extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Employee.init(
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
    modelName: "Employee",
    tableName: "employees",
    timestamps: true,
  }
);
