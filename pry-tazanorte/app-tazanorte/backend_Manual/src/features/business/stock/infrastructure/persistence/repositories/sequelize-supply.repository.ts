import { Injectable } from '@nestjs/common';
import { Supply } from '../../../domain/entities/supplies.entity';
import { SupplyModel } from '../models/supply.model';

export const SUPPLY_REPOSITORY = 'SUPPLY_REPOSITORY';

@Injectable()
export class SequelizeSupplyRepository {
  async create(supply: Supply): Promise<Supply> {
    const model = await SupplyModel.create({
      codigo: supply.codigo,
      nombre: supply.nombre,
      unidad_medida: supply.unidadMedida,
      stock_minimo: supply.stockMinimo,
      is_active: supply.isActive,
    });
    return new Supply({
      id: model.id,
      codigo: model.codigo,
      nombre: model.nombre,
      unidadMedida: model.unidad_medida,
      stockMinimo: Number(model.stock_minimo),
      isActive: model.is_active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findAll(): Promise<Supply[]> {
    const models = await SupplyModel.findAll({ order: [['id', 'ASC']] });
    return models.map(m => new Supply({
      id: m.id,
      codigo: m.codigo,
      nombre: m.nombre,
      unidadMedida: m.unidad_medida,
      stockMinimo: Number(m.stock_minimo),
      isActive: m.is_active,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }
}

export const supplyRepositoryProvider = {
  provide: SUPPLY_REPOSITORY,
  useClass: SequelizeSupplyRepository,
};
