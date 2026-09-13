import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database/database.config';
import { DatabaseModule } from './config/database/database.module';
import { ClientsModule } from './features/business/clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    DatabaseModule,
    ClientsModule,
  ],
})
export class AppModule {}
