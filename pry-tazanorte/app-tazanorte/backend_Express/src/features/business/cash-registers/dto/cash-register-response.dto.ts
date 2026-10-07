import { CashRegister, CashRegisterI } from "../cash-register.model";

/** Respuesta HTTP de un turno de caja. No hay campos internos que ocultar. */
export type CashRegisterResponseDto = CashRegisterI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toCashRegisterResponse(cashRegister: CashRegister): CashRegisterResponseDto {
  return cashRegister.toJSON() as CashRegisterResponseDto;
}
