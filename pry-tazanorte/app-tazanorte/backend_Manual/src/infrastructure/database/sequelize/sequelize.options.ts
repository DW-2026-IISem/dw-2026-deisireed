import { SequelizeOptions } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface';

export function getSequelizeOptions(dialect: DatabaseDialect): SequelizeOptions {
  const prefix = dialect.toUpperCase();

  const host = process.env[`${prefix}_HOST`] || process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env[`${prefix}_PORT`] || process.env.DB_PORT || 3306);
  const username = process.env[`${prefix}_USER`] || process.env.DB_USER || 'deisireed';
  const password = process.env[`${prefix}_PASSWORD`] ?? process.env.DB_PASSWORD ?? '0104*Deisi';
  const database = process.env[`${prefix}_DATABASE`] || process.env.DB_NAME || 'tazanorte_mysql';

  return {
    dialect: dialect as any,
    host,
    port,
    username,
    password,
    database,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
}
