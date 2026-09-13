import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSequelizeInstance } from './sequelize.factory.js';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';

@Global()
@Module({
  providers: [
    {
      provide: 'SEQUELIZE',
      useFactory: (configService: ConfigService) => {
        const dialect =
          configService.get<DatabaseDialect>('DB_DIALECT') ||
          (process.env.DB_DIALECT as DatabaseDialect) ||
          DatabaseDialect.MySQL;

        return createSequelizeInstance(dialect);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SEQUELIZE'],
})
export class SequelizeDatabaseModule {}
