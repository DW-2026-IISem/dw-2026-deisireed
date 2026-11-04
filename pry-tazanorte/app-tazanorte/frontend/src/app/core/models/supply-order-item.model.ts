import { Money, Timestamps } from './api.model';

/** Tabla `supply_order_items` — /api/insumo-pedido-detalles */
export interface SupplyOrderItem extends Timestamps {
  id: number;
  pedido_detalle_id: number;
  insumo_id: number;
  cantidad_usada: Money;
  is_active: boolean;
}

export interface SupplyOrderItemPayload {
  pedido_detalle_id: number;
  insumo_id: number;
  cantidad_usada: number;
  is_active?: boolean;
}
