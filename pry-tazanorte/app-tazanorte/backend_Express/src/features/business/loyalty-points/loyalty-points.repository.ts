import { CreationAttributes, Transaction } from "sequelize";
import { LoyaltyMovementType, LoyaltyPoint, LoyaltyPointI } from "./loyalty-point.model";

/**
 * Capa Repository del feature LoyaltyPoints.
 * Única responsable de hablar con Sequelize (el modelo `LoyaltyPoint`).
 */
export class LoyaltyPointsRepository {
  // ================== READ ==================
  /** Todos los movimientos activos (más recientes primero). */
  public async findAllActive(): Promise<LoyaltyPoint[]> {
    return LoyaltyPoint.findAll({ where: { is_active: true }, order: [["fecha", "DESC"]] });
  }

  /** Un movimiento por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<LoyaltyPoint | null> {
    return LoyaltyPoint.findByPk(id, { transaction });
  }

  /** Acumulación activa ya registrada para un pedido (o `null`). */
  public async findActiveAccumulationByOrder(
    pedido_id: number,
    transaction?: Transaction
  ): Promise<LoyaltyPoint | null> {
    return LoyaltyPoint.findOne({
      where: { pedido_id, tipo: "acumulacion", is_active: true },
      transaction,
    });
  }

  /** Σ `cantidad` de los movimientos activos de un tipo para un cliente. */
  public async sumActive(
    cliente_id: number,
    tipo: LoyaltyMovementType,
    transaction?: Transaction
  ): Promise<number> {
    const total = await LoyaltyPoint.sum("cantidad", {
      where: { cliente_id, tipo, is_active: true },
      transaction,
    });
    return Number(total ?? 0);
  }

  // ================== CREATE ==================
  public async create(
    data: CreationAttributes<LoyaltyPoint>,
    transaction?: Transaction
  ): Promise<LoyaltyPoint> {
    return LoyaltyPoint.create(data, { transaction });
  }

  // ================== UPDATE ==================
  public async update(
    point: LoyaltyPoint,
    data: Partial<LoyaltyPointI>,
    transaction?: Transaction
  ): Promise<LoyaltyPoint> {
    return point.update(data, { transaction });
  }

  // ================== DELETE ==================
  public async delete(point: LoyaltyPoint, transaction?: Transaction): Promise<void> {
    await point.destroy({ transaction });
  }
}
