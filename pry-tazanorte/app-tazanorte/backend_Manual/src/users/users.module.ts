import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './infrastructure/persistence/user.model';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { UsersController } from './infrastructure/controllers/users.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserRepository],
  controllers: [UsersController],
  exports: [UserRepository, SequelizeModule],
})
export class UsersModule {}
