import { Money, Timestamps } from './api.model';

/** Tabla `order_items` — /api/detalle-pedidos */
export interface OrderItem extends Timestamps {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  valor_unitario: Money;
  total: Money;
  observaciones: string | null;
  is_active: boolean;
}

export interface OrderItemPayload {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  observaciones?: string | null;
  is_active?: boolean;
}
