import { Money, Timestamps } from './api.model';

export const PAYMENT_METHODS = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'NEQUI'] as const;
export const PAYMENT_STATES = ['PENDIENTE', 'COMPLETADO', 'CANCELADO'] as const;

export type PaymentReferenceType = 'PEDIDO';
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentState = (typeof PAYMENT_STATES)[number];

/** Tabla `payments` — /api/pagos */
export interface Payment extends Timestamps {
  id: number;
  referencia_tipo: PaymentReferenceType;
  referencia_id: number;
  metodo: PaymentMethod;
  monto: Money;
  fecha: string;
  estado: PaymentState;
  is_active: boolean;
}

export interface PaymentPayload {
  referencia_tipo: PaymentReferenceType;
  referencia_id: number;
  metodo: PaymentMethod;
  monto: number;
  fecha?: string;
  estado?: PaymentState;
  is_active?: boolean;
}
