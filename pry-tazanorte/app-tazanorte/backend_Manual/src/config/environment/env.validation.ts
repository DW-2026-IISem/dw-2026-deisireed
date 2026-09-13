import { resolveDialectCredentials } from './db-env.js';
import { DatabaseDialect, Environment } from './env.interface.js';

export function validate(config: Record<string, unknown>): Environment {
  const dialect = (config.DB_DIALECT as DatabaseDialect) || 'mysql';
  const dbConfig = resolveDialectCredentials(dialect);

  return {
    port: Number(config.PORT || 3000),
    nodeEnv: (config.NODE_ENV as string) || 'development',
    database: dbConfig,
  };
}
