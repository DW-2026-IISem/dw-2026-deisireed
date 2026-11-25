import { Money } from '../models/order-item.model';
import { OrderState } from '../models/order.model';

/** DECIMAL puede llegar como string ("9000.00"): siempre normalizar antes de sumar. */
export function toNumber(value: Money | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  return typeof value === 'number' ? value : Number.parseFloat(value) || 0;
}

/** Mensaje legible desde un HttpErrorResponse del backend (`{ error: "..." }`). */
export function httpMessage(error: unknown): string {
  const e = error as {
    status?: number;
    error?: { error?: string; message?: string };
    message?: string;
  };
  if (e?.status === 0) {
    return 'No se pudo conectar con el servidor.';
  }
  if (e?.status === 401) {
    return 'Sesión requerida (401): el backend exige JWT en todas las rutas.';
  }
  if (e?.status === 403) {
    return 'Tu rol no tiene permiso para esta operación (403).';
  }
  return e?.error?.error ?? e?.error?.message ?? e?.message ?? 'Error inesperado.';
}

export const ORDER_STATE_LABEL: Record<OrderState, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  en_preparacion: 'En preparación',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

/** Espejo de ALLOWED_TRANSITIONS del backend (sin "cancelado", que tiene su botón). */
export const ORDER_NEXT_STATES: Record<OrderState, OrderState[]> = {
  pendiente: ['pagado'],
  pagado: ['en_preparacion', 'entregado'],
  en_preparacion: ['entregado'],
  entregado: [],
  cancelado: [],
};

export function orderSeverity(
  state: OrderState,
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  switch (state) {
    case 'pendiente':
      return 'warn';
    case 'pagado':
    case 'en_preparacion':
      return 'info';
    case 'entregado':
      return 'success';
    case 'cancelado':
      return 'danger';
    default:
      return 'secondary';
  }
}
