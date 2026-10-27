import { LoyaltyMovementType } from "../loyalty-point.model";

/**
 * Datos de entrada de `POST /api/puntos-fidelizacion`.
 *
 *  - `acumulacion`: exige `pedido_id`; `cantidad` **no** se envía, la calcula
 *    el backend a partir del total del pedido.
 *  - `redencion`: exige `cantidad`; no lleva `pedido_id`.
 */
export interface CreateLoyaltyPointDto {
  cliente_id: number;
  tipo: LoyaltyMovementType;
  pedido_id?: number | null;
  cantidad?: number;
  observaciones?: string | null;
  /** Opcional: por defecto `true`. Tras crearlo, sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
