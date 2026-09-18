import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'desireed'),
        password: configService.get<string>('DB_PASSWORD', '0104*Deisi'),
        database: configService.get<string>('DB_DATABASE', 'tazanorte_mysql'),
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
