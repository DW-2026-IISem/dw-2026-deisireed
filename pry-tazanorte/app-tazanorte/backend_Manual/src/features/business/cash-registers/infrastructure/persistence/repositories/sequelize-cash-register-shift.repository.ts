import { Injectable } from '@nestjs/common';
import { CashRegisterShift } from '../../../domain/entities/cash-register-shift.entity';
import { CASH_REGISTER_SHIFT_REPOSITORY, ICashRegisterShiftRepository } from '../../../domain/interfaces/cash-register-shift-repository.interface';
import { CashRegisterShiftModel } from '../models/cash-register-shift.model';

@Injectable()
export class SequelizeCashRegisterShiftRepository implements ICashRegisterShiftRepository {
  async create(shift: CashRegisterShift): Promise<CashRegisterShift> {
    const model = await CashRegisterShiftModel.create({
      nombre: shift.nombre,
      descripcion: shift.descripcion,
      is_active: shift.isActive,
    });
    return new CashRegisterShift({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion ?? undefined,
      isActive: model.is_active,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  async findAll(): Promise<CashRegisterShift[]> {
    const models = await CashRegisterShiftModel.findAll({ order: [['id', 'ASC']] });
    return models.map(m => new CashRegisterShift({
      id: m.id,
      nombre: m.nombre,
      descripcion: m.descripcion ?? undefined,
      isActive: m.is_active,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));
  }

  async findById(id: number): Promise<CashRegisterShift | null> {
    const model = await CashRegisterShiftModel.findByPk(id);
    if (!model) return null;
    return new CashRegisterShift({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion ?? undefined,
      isActive: model.is_active,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    });
  }

  async update(id: number, data: Partial<CashRegisterShift>): Promise<CashRegisterShift> {
    const model = await CashRegisterShiftModel.findByPk(id);
    if (!model) throw new Error(`TurnoCaja ${id} no encontrado`);
    await model.update({
      nombre: data.nombre,
      descripcion: data.descripcion,
      is_active: data.isActive,
    });
    return this.findById(id) as Promise<CashRegisterShift>;
  }

  async delete(id: number): Promise<void> {
    await CashRegisterShiftModel.destroy({ where: { id } });
  }
}

export const cashRegisterShiftRepositoryProvider = {
  provide: CASH_REGISTER_SHIFT_REPOSITORY,
  useClass: SequelizeCashRegisterShiftRepository,
};
