import { CreationAttributes, Transaction } from "sequelize";
import { CashRegister, CashRegisterI } from "./cash-register.model";

/**
 * Capa Repository del feature CashRegisters.
 * Única responsable de hablar con Sequelize (el modelo `CashRegister`).
 */
export class CashRegistersRepository {
  // ================== READ ==================
  /** Todos los turnos activos. */
  public async findAllActive(): Promise<CashRegister[]> {
    return CashRegister.findAll({ where: { is_active: true } });
  }

  /** Un turno por PK (o `null`). Acepta transacción para flujos de pedidos. */
  public async findById(id: number, transaction?: Transaction): Promise<CashRegister | null> {
    return CashRegister.findByPk(id, { transaction });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<CashRegister>): Promise<CashRegister> {
    return CashRegister.create(data);
  }

  // ================== UPDATE ==================
  public async update(
    cashRegister: CashRegister,
    data: Partial<CashRegisterI>
  ): Promise<CashRegister> {
    return cashRegister.update(data);
  }

  // ================== DELETE ==================
  public async delete(cashRegister: CashRegister): Promise<void> {
    await cashRegister.destroy();
  }
}
