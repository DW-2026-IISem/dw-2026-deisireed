import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export class Payment extends Model {
  public id!: number;
  public referencia_tipo!: string;
  public referencia_id!: number;
  public metodo!: string;
  public monto!: number;
  public fecha!: Date;
  public estado!: string;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    referencia_tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "COMPLETADO",
    },
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: true,
  }
);
