import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/environment/env.config.js';
import { DatabaseConfigModule } from './config/database/database.module.js';
import { SequelizeDatabaseModule } from './infrastructure/database/sequelize/sequelize.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    DatabaseConfigModule,
    SequelizeDatabaseModule,
  ],
})
export class AppModule {}
