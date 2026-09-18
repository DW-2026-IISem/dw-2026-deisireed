import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { userRepositoryProvider } from './infrastructure/persistence/repositories/sequelize-user.repository';
import { UsersController } from './presentation/http/controllers/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    userRepositoryProvider,
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [userRepositoryProvider],
})
export class UsersModule {}
