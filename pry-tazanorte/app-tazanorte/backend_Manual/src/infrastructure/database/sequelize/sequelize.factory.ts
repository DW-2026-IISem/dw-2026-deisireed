import { Sequelize } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';
import { getSequelizeOptions } from './sequelize.options.js';

export const createSequelizeInstance = async (dialect: DatabaseDialect): Promise<Sequelize> => {
  const options = getSequelizeOptions(dialect);
  const sequelize = new Sequelize(options);

  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${dialect.toUpperCase()}`);
  } catch (error) {
    console.error(`❌ Error al conectar a ${dialect.toUpperCase()}:`, error);
    throw error;
  }

  return sequelize;
};
