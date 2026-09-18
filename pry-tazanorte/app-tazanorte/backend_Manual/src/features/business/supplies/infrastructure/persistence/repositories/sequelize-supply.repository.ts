import { Injectable } from '@nestjs/common';
import { Supply } from '../../../domain/entities/supply.entity';
import { SUPPLY_REPOSITORY, ISupplyRepository } from '../../../domain/interfaces/supply-repository.interface';
import { SupplyModel } from '../models/supply.model';

@Injectable()
export class SequelizeSupplyRepository implements ISupplyRepository {
  async create(supply: Supply): Promise<Supply> {
    const model = await SupplyModel.create({
      nombre: supply.nombre,
      unidad_medida: supply.unidadMedida,
      stock_actual: supply.stockActual,
      stock_minimo: supply.stockMinimo,
      costo_unitario: supply.costoUnitario,
      is_active: supply.isActive,
    });
    return new Supply({
      id: model.id,
      nombre: model.nombre,
      unidadMedida: model.unidad_medida,
      stockActual: Number(model.stock_actual),
      stockMinimo: model.stock_minimo ? Number(model.stock_minimo) : undefined,
      costoUnitario: model.costo_unitario ? Number(model.costo_unitario) : undefined,
      isActive: model.is_active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findAll(): Promise<Supply[]> {
    const models = await SupplyModel.findAll({ order: [['id', 'ASC']] });
    return models.map(m => new Supply({
      id: m.id,
      nombre: m.nombre,
      unidadMedida: m.unidad_medida,
      stockActual: Number(m.stock_actual),
      stockMinimo: m.stock_minimo ? Number(m.stock_minimo) : undefined,
      costoUnitario: m.costo_unitario ? Number(m.costo_unitario) : undefined,
      isActive: m.is_active,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }

  async findById(id: number): Promise<Supply | null> {
    const model = await SupplyModel.findByPk(id);
    if (!model) return null;
    return new Supply({
      id: model.id,
      nombre: model.nombre,
      unidadMedida: model.unidad_medida,
      stockActual: Number(model.stock_actual),
      stockMinimo: model.stock_minimo ? Number(model.stock_minimo) : undefined,
      costoUnitario: model.costo_unitario ? Number(model.costo_unitario) : undefined,
      isActive: model.is_active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async update(id: number, data: Partial<Supply>): Promise<Supply> {
    const model = await SupplyModel.findByPk(id);
    if (!model) throw new Error(`Insumo ${id} no encontrado`);
    await model.update({
      nombre: data.nombre,
      unidad_medida: data.unidadMedida,
      stock_actual: data.stockActual,
      stock_minimo: data.stockMinimo,
      costo_unitario: data.costoUnitario,
      is_active: data.isActive,
    });
    return this.findById(id) as Promise<Supply>;
  }

  async delete(id: number): Promise<void> {
    await SupplyModel.destroy({ where: { id } });
  }
}

export const supplyRepositoryProvider = {
  provide: SUPPLY_REPOSITORY,
  useClass: SequelizeSupplyRepository,
};
