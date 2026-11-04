import { Timestamps } from './api.model';

export type LoyaltyMovementType = 'acumulacion' | 'redencion';

/** Tabla `loyalty_points` — /api/puntos-fidelizacion */
export interface LoyaltyPoint extends Timestamps {
  id: number;
  cliente_id: number;
  pedido_id: number | null;
  tipo: LoyaltyMovementType;
  cantidad: number;
  fecha: string;
  observaciones: string | null;
  is_active: boolean;
}

export interface LoyaltyPointPayload {
  cliente_id: number;
  tipo: LoyaltyMovementType;
  pedido_id?: number | null;
  cantidad?: number;
  observaciones?: string | null;
  is_active?: boolean;
}
