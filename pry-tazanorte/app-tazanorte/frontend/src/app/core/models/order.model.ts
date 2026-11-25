import { Money, OrderItem } from './order-item.model';

export type OrderChannel = 'caja' | 'para_llevar';
export type OrderState = 'pendiente' | 'pagado' | 'en_preparacion' | 'entregado' | 'cancelado';

export interface Order {
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

export interface OrderCreatePayload {
  cliente_id: number;
  turno_caja_id: number;
  canal?: OrderChannel;
  items: OrderLineInput[];
}

export interface OrderUpdatePayload {
  cliente_id?: number;
  turno_caja_id?: number;
  canal?: OrderChannel;
  fecha?: string;
}

/** Catálogos mínimos que necesitan pedidos y dashboard. */
export interface ClientRef {
  id: number;
  nombre: string;
  numero_documento?: string;
}
export interface ProductRef {
  id: number;
  sku?: string;
  nombre: string;
  precio: Money;
}
export interface CashRegisterRef {
  id: number;
  nombre: string;
}
