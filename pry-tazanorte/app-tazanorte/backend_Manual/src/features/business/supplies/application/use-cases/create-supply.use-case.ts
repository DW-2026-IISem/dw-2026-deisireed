import { Injectable, Inject } from '@nestjs/common';
import { Supply } from '../../domain/entities/supply.entity';
import { SUPPLY_REPOSITORY, ISupplyRepository } from '../../domain/interfaces/supply-repository.interface';
import { CreateSupplyDto } from '../../presentation/dtos/create-supply.dto';

@Injectable()
export class CreateSupplyUseCase {
  constructor(
    @Inject(SUPPLY_REPOSITORY)
    private readonly supplyRepository: ISupplyRepository,
  ) {}

  async execute(dto: CreateSupplyDto): Promise<Supply> {
    const supply = new Supply(dto);
    return this.supplyRepository.create(supply);
  }
}
