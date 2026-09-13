import { DatabaseConfig, DatabaseDialect } from './env.interface.js';

export const resolveDialectCredentials = (dialect: DatabaseDialect): DatabaseConfig => {
  return {
    dialect,
    host: process.env.DB_MYSQL_HOST || process.env.DB_POSTGRES_HOST || 'localhost',
    port: Number(process.env.DB_MYSQL_PORT || process.env.DB_POSTGRES_PORT || 3306),
    username: process.env.DB_MYSQL_USERNAME || process.env.DB_POSTGRES_USER || 'deisireed',
    password: process.env.DB_MYSQL_PASSWORD || process.env.DB_POSTGRES_PASSWORD || '',
    database: process.env.DB_MYSQL_NAME || process.env.DB_POSTGRES_DB || 'tazanorte',
  };
};
