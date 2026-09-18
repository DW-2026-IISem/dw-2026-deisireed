import { Supply } from '../entities/supply.entity';

export const SUPPLY_REPOSITORY = 'SUPPLY_REPOSITORY';

export interface ISupplyRepository {
  create(supply: Supply): Promise<Supply>;
  findAll(): Promise<Supply[]>;
  findById(id: number): Promise<Supply | null>;
  update(id: number, data: Partial<Supply>): Promise<Supply>;
  delete(id: number): Promise<void>;
}
