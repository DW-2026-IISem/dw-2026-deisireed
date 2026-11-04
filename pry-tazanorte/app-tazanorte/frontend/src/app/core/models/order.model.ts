import { Money, Timestamps } from './api.model';
import { OrderItem } from './order-item.model';

export type OrderChannel = 'caja' | 'para_llevar';
export type OrderState = 'pendiente' | 'pagado' | 'en_preparacion' | 'entregado' | 'cancelado';

/** Tabla `orders` — /api/pedidos. El pedido no tiene `is_active`: su ciclo es `estado`. */
export interface Order extends Timestamps {
  id: number;
  cliente_id: number;
  turno_caja_id: number;
  canal: OrderChannel;
  fecha: string;
  subtotal: Money;
  total: Money;
  estado: OrderState;
  items?: OrderItem[];
}

export interface OrderLineInput {
  producto_id: number;
  cantidad: number;
  observaciones?: string | null;
}

/** No lleva subtotal, total ni estado: los calcula/fija Express. */
export interface OrderCreatePayload {
  cliente_id: number;
  turno_caja_id: number;
  canal?: OrderChannel;
  fecha?: string;
  items: OrderLineInput[];
}

export interface OrderUpdatePayload {
  cliente_id?: number;
  turno_caja_id?: number;
  canal: OrderChannel;
  fecha?: string;
}
