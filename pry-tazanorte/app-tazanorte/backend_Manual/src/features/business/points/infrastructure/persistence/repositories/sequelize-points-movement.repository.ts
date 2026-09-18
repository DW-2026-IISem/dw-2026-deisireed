import { Injectable } from '@nestjs/common';
import { PointsMovement } from '../../../domain/entities/points-movement.entity';
import { POINTS_MOVEMENT_REPOSITORY, IPointsMovementRepository } from '../../../domain/interfaces/points-movement-repository.interface';
import { PointsMovementModel } from '../models/points-movement.model';

@Injectable()
export class SequelizePointsMovementRepository implements IPointsMovementRepository {
  async create(movement: PointsMovement): Promise<PointsMovement> {
    const model = await PointsMovementModel.create({
      referencia_id: movement.referenciaId,
      tipo: movement.tipo,
      fecha: movement.fecha,
      cantidad: movement.cantidad,
      observaciones: movement.observaciones,
      estado: movement.estado,
    });
    return new PointsMovement({
      id: model.id,
      referenciaId: model.referencia_id,
      tipo: model.tipo,
      fecha: model.fecha,
      cantidad: model.cantidad,
      observaciones: model.observaciones ?? undefined,
      estado: model.estado,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findAll(): Promise<PointsMovement[]> {
    const models = await PointsMovementModel.findAll({ order: [['id', 'ASC']] });
    return models.map(m => new PointsMovement({
      id: m.id,
      referenciaId: m.referencia_id,
      tipo: m.tipo,
      fecha: m.fecha,
      cantidad: m.cantidad,
      observaciones: m.observaciones ?? undefined,
      estado: m.estado,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }

  async findById(id: number): Promise<PointsMovement | null> {
    const model = await PointsMovementModel.findByPk(id);
    if (!model) return null;
    return new PointsMovement({
      id: model.id,
      referenciaId: model.referencia_id,
      tipo: model.tipo,
      fecha: model.fecha,
      cantidad: model.cantidad,
      observaciones: model.observaciones ?? undefined,
      estado: model.estado,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async update(id: number, data: Partial<PointsMovement>): Promise<PointsMovement> {
    const model = await PointsMovementModel.findByPk(id);
    if (!model) throw new Error(`MovimientoPuntos ${id} no encontrado`);
    await model.update({
      referencia_id: data.referenciaId,
      tipo: data.tipo,
      fecha: data.fecha,
      cantidad: data.cantidad,
      observaciones: data.observaciones,
      estado: data.estado,
    });
    return this.findById(id) as Promise<PointsMovement>;
  }

  async delete(id: number): Promise<void> {
    await PointsMovementModel.destroy({ where: { id } });
  }
}

export const pointsMovementRepositoryProvider = {
  provide: POINTS_MOVEMENT_REPOSITORY,
  useClass: SequelizePointsMovementRepository,
};
