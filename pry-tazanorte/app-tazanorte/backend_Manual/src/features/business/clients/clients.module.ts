import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CLIENT_REPOSITORY } from './domain/interfaces/client-repository.interface';
import { ClientModel } from './infrastructure/persistence/models/client.model';
import { ClientRepository } from './infrastructure/persistence/repositories/client.repository';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { GetClientUseCase } from './application/use-cases/get-client.use-case';
import { ListClientsUseCase } from './application/use-cases/list-clients.use-case';
import { ClientsController } from './presentation/http/controllers/clients.controller';
import { HashingModule } from '../../../../infrastructure/security/hashing/hashing.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ClientModel]),
    HashingModule,
  ],
  controllers: [ClientsController],
  providers: [
    {
      provide: CLIENT_REPOSITORY,
      useClass: ClientRepository,
    },
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    GetClientUseCase,
    ListClientsUseCase,
  ],
  exports: [CLIENT_REPOSITORY, GetClientUseCase],
})
export class ClientsModule {}
