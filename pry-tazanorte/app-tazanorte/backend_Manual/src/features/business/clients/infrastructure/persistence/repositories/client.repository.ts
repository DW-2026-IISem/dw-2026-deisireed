import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginatedResult } from '../../../../../../common/interfaces/pagination.interface';
import { calculatePagination } from '../../../../../../common/utils/pagination.util';
import { Client } from '../../../domain/entities/client.entity';
import { ClientFilterDto } from '../../../application/dto/client-filter.dto';
import {
  CLIENT_REPOSITORY,
  IClientRepository,
} from '../../../domain/interfaces/client-repository.interface';
import { ClientMapper } from '../../../application/mappers/client.mapper';
import { ClientModel } from '../models/client.model';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectModel(ClientModel)
    private readonly clientModel: typeof ClientModel,
  ) {}

  async create(client: Client): Promise<Client> {
    const rawData = ClientMapper.toPersistence(client);
    const created = await this.clientModel.create(rawData);
    return ClientMapper.toDomain(created);
  }

  async update(client: Client): Promise<Client> {
    const model = await this.clientModel.findByPk(client.id);
    if (!model) return null;

    const rawData = ClientMapper.toPersistence(client);
    await model.update(rawData);
    return ClientMapper.toDomain(model);
  }

  async delete(id: number): Promise<void> {
    await this.clientModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Client | null> {
    const model = await this.clientModel.findByPk(id);
    return model ? ClientMapper.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const model = await this.clientModel.findOne({ where: { email } });
    return model ? ClientMapper.toDomain(model) : null;
  }

  async findAll(filter: ClientFilterDto): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 10, search, status } = filter;
    const { offset } = calculatePagination(page, limit);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await this.clientModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      items: rows.map((row: ClientModel) => ClientMapper.toDomain(row)),
      totalItems: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    } as unknown as PaginatedResult<Client>;
  }
}
