import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Client } from '../../domain/entities/client.entity';
import {
  CLIENT_REPOSITORY,
  IClientRepository,
} from '../../domain/interfaces/client-repository.interface';
import { ClientFilterDto } from '../dto/client-filter.dto';
import { ClientResponseDto } from '../dto/client-response.dto';
import { ClientMapper } from '../mappers/client.mapper';

@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(
    filter: ClientFilterDto,
  ): Promise<PaginatedResult<ClientResponseDto>> {
    const result = await this.clientRepository.findAll(filter);

    return {
      ...result,
      items: result.items.map((client: Client) => ClientMapper.toResponse(client)),
    };
  }
}
