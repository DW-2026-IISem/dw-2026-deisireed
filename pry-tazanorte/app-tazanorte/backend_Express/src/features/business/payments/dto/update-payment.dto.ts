import { PaymentMethod, PaymentReferenceType, PaymentState } from "../payment.model";

/**
 * Datos de entrada de `PUT /api/pagos/:id` (reemplazo completo).
 * `is_active` **no** está aquí: sólo cambia con `PATCH /api/pagos/:id/deactivate`.
 */
export interface UpdatePaymentDto {
  referencia_tipo: PaymentReferenceType;
  referencia_id: number;
  metodo: PaymentMethod;
  monto: number;
  fecha: string;
  estado: PaymentState;
}
