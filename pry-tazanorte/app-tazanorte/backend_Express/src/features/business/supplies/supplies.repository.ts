import { CreationAttributes, Op, Transaction } from "sequelize";
import { Supply, SupplyI } from "./supply.model";

/**
 * Capa Repository del feature Supplies.
 * Única responsable de hablar con Sequelize (el modelo `Supply`).
 */
export class SuppliesRepository {
  // ================== READ ==================
  /** Todos los insumos activos. */
  public async findAllActive(): Promise<Supply[]> {
    return Supply.findAll({ where: { is_active: true } });
  }

  /** Un insumo por PK (o `null`). Acepta transacción para flujos de recetas. */
  public async findById(id: number, transaction?: Transaction): Promise<Supply | null> {
    return Supply.findByPk(id, { transaction });
  }

  /** Un insumo por código, opcionalmente excluyendo un id. */
  public async findByCodigo(codigo: string, excludeId?: number): Promise<Supply | null> {
    return Supply.findOne({
      where: {
        codigo,
        ...(excludeId !== undefined ? { id: { [Op.ne]: excludeId } } : {}),
      },
    });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<Supply>): Promise<Supply> {
    return Supply.create(data);
  }

  // ================== UPDATE ==================
  public async update(supply: Supply, data: Partial<SupplyI>): Promise<Supply> {
    return supply.update(data);
  }

  // ================== DELETE ==================
  public async delete(supply: Supply): Promise<void> {
    await supply.destroy();
  }
}
