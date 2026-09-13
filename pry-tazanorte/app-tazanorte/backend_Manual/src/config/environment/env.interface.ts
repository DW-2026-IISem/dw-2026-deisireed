export enum DatabaseDialect {
  MySQL = 'mysql',
  Postgres = 'postgres',
  MSSQL = 'mssql',
  Oracle = 'oracle',
}

export interface DatabaseConfig {
  dialect: DatabaseDialect;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  connectString?: string;
}

export interface Environment {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
}
