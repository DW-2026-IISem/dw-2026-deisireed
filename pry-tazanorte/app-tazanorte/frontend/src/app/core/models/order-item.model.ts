export type Money = number | string;

export interface OrderItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  valor_unitario: Money;
  total: Money;
  observaciones: string | null;
  is_active: boolean;
}

export interface OrderItemCreatePayload {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  observaciones?: string | null;
}

export interface OrderItemUpdatePayload {
  cantidad?: number;
  observaciones?: string | null;
}
