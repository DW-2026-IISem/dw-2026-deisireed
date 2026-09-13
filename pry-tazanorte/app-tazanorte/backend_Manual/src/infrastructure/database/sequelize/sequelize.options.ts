import { Options } from 'sequelize';
import { resolveDialectCredentials } from '../../../config/environment/db-env.js';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';

export const getSequelizeOptions = (dialect: DatabaseDialect): Options => {
  const credentials = resolveDialectCredentials(dialect);

  const baseOptions: Options = {
    dialect: credentials.dialect as any,
    host: credentials.host,
    port: credentials.port,
    username: credentials.username,
    password: credentials.password,
    database: credentials.database,
    logging: false,
  };

  switch (dialect) {
    case DatabaseDialect.MSSQL:
      return {
        ...baseOptions,
        dialectOptions: {
          options: { encrypt: false },
        },
      };

    case DatabaseDialect.Oracle:
      return {
        ...baseOptions,
        dialectOptions: {
          connectString: credentials.connectString,
        },
      };

    default:
      return baseOptions;
  }
};
