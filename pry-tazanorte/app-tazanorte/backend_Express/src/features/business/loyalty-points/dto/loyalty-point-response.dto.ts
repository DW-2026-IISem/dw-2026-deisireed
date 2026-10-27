import { LoyaltyPoint, LoyaltyPointI } from "../loyalty-point.model";

/** Respuesta HTTP de un movimiento de puntos. */
export type LoyaltyPointResponseDto = LoyaltyPointI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toLoyaltyPointResponse(point: LoyaltyPoint): LoyaltyPointResponseDto {
  return point.toJSON() as LoyaltyPointResponseDto;
}
