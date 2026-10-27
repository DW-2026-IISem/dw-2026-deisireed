import { CreationAttributes, Transaction } from "sequelize";
import { Payment, PaymentI } from "./payment.model";

/**
 * Capa Repository del feature Payments.
 * Única responsable de hablar con Sequelize (el modelo `Payment`).
 */
export class PaymentsRepository {
  // ================== READ ==================
  /** Todos los pagos activos (más recientes primero). */
  public async findAllActive(): Promise<Payment[]> {
    return Payment.findAll({ where: { is_active: true }, order: [["fecha", "DESC"]] });
  }

  /** Un pago por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Payment | null> {
    return Payment.findByPk(id, { transaction });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<Payment>): Promise<Payment> {
    return Payment.create(data);
  }

  // ================== UPDATE ==================
  public async update(payment: Payment, data: Partial<PaymentI>): Promise<Payment> {
    return payment.update(data);
  }

  // ================== DELETE ==================
  public async delete(payment: Payment): Promise<void> {
    await payment.destroy();
  }
}
