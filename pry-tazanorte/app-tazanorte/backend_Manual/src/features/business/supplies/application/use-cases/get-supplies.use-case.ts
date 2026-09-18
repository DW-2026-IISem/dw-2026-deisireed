import { Injectable, Inject } from '@nestjs/common';
import { Supply } from '../../domain/entities/supply.entity';
import { SUPPLY_REPOSITORY, ISupplyRepository } from '../../domain/interfaces/supply-repository.interface';

@Injectable()
export class GetSuppliesUseCase {
  constructor(
    @Inject(SUPPLY_REPOSITORY)
    private readonly supplyRepository: ISupplyRepository,
  ) {}

  async execute(): Promise<Supply[]> {
    return this.supplyRepository.findAll();
  }
}
