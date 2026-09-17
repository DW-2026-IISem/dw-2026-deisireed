import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { createSequelizeInstance } from './sequelize.factory';
import { DatabaseSeederService } from '../seeders/database-seeder.service';

export const SEQUELIZE_PROVIDER = 'SEQUELIZE_CONNECTION';

const sequelizeProvider = {
  provide: SEQUELIZE_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    const dialect =
      configService.get<string>('env.DB_DIALECT') ||
      configService.get<string>('DB_DIALECT') ||
      process.env.DB_DIALECT;

    return await createSequelizeInstance(dialect as any);
  },
  inject: [ConfigService],
};

const sequelizeClassProvider = {
  provide: Sequelize,
  useExisting: SEQUELIZE_PROVIDER,
};

@Global()
@Module({
  providers: [
    sequelizeProvider,
    sequelizeClassProvider,
    DatabaseSeederService,
  ],
  exports: [
    sequelizeProvider,
    sequelizeClassProvider,
    DatabaseSeederService,
  ],
})
export class SequelizeDatabaseModule {}
