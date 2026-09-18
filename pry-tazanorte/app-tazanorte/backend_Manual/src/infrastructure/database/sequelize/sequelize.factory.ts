import { Sequelize } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface';
import { getSequelizeOptions } from './sequelize.options';

import { ClientModel } from '../../../features/business/clients/infrastructure/persistence/models/client.model';
import { ProductModel } from '../../../features/business/products/infrastructure/persistence/models/product.model';
import { SaleModel } from '../../../features/business/sales/infrastructure/persistence/models/sale.model';
import { ProductSaleModel } from '../../../features/business/sales/infrastructure/persistence/models/product-sale.model';
import { PaymentModel } from '../../../features/business/payments/infrastructure/persistence/models/payment.model';
import { EmployeeModel } from '../../../features/business/employees/infrastructure/persistence/models/employee.model';
import { CashRegisterShiftModel } from '../../../features/business/cash-registers/infrastructure/persistence/models/cash-register-shift.model';
import { PointsMovementModel } from '../../../features/business/points/infrastructure/persistence/models/points-movement.model';
import { SupplyModel } from '../../../features/business/stock/infrastructure/persistence/models/supply.model';
import { RecipeModel } from '../../../features/business/recipes/infrastructure/persistence/models/recipe.model';

import { UserModel } from '../../../features/auth/users/infrastructure/persistence/models/user.model';
import { RoleModel } from '../../../features/auth/roles/infrastructure/persistence/models/role.model';
import { RefreshTokenModel } from '../../../features/auth/tokens/infrastructure/persistence/models/refresh-token.model';

export const ALL_MODELS = [
  ClientModel,
  ProductModel,
  SaleModel,
  ProductSaleModel,
  PaymentModel,
  EmployeeModel,
  CashRegisterShiftModel,
  PointsMovementModel,
  SupplyModel,
  RecipeModel,
  UserModel,
  RoleModel,
  RefreshTokenModel,
];

export async function createSequelizeInstance(
  dialect: DatabaseDialect,
): Promise<Sequelize> {
  const options = getSequelizeOptions(dialect);

  let dialectModule: any;

  switch (dialect) {
    case DatabaseDialect.MySQL:
      dialectModule = require('mysql2');
      break;
    case DatabaseDialect.Postgres:
      dialectModule = require('pg');
      break;
    case DatabaseDialect.MSSQL:
      dialectModule = require('tedious');
      break;
    case DatabaseDialect.Oracle:
      dialectModule = require('oracledb');
      break;
    default:
      throw new Error(`Dialecto no soportado: ${dialect}`);
  }

  const sequelize = new Sequelize({
    ...options,
    dialectModule,
    models: ALL_MODELS,
  } as any);

  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${dialect.toUpperCase()}`);
  } catch (error: any) {
    console.error(
      `❌ Error conectando a ${dialect.toUpperCase()}:`,
      error.message,
    );
    throw error;
  }

  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: false });
    console.log('✅ Tablas sincronizadas');
  }

  return sequelize;
}
