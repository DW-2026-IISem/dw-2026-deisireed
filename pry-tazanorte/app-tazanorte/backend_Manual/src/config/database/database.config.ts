import { registerAs } from '@nestjs/config';
import { resolveDialectCredentials } from '../environment/db-env.js';
import { DatabaseDialect } from '../environment/env.interface.js';

export const databaseConfig = registerAs('database', () => {
  const dialect = (process.env.DB_DIALECT as DatabaseDialect) || 'mysql';
  return resolveDialectCredentials(dialect);
});
