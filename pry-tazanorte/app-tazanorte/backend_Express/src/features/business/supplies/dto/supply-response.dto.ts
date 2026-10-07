import { Supply, SupplyI } from "../supply.model";

/**
 * Respuesta HTTP de un insumo. `stock_minimo` siempre sale como número: MySQL
 * devuelve los DECIMAL como texto y el mapper es el único lugar donde se normaliza.
 */
export type SupplyResponseDto = SupplyI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toSupplyResponse(supply: Supply): SupplyResponseDto {
  const data = supply.toJSON() as SupplyI;
  return { ...data, stock_minimo: Number(data.stock_minimo) };
}
