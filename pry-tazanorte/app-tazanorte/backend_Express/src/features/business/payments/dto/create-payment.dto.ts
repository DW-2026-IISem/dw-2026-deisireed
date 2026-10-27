import { PaymentMethod, PaymentReferenceType, PaymentState } from "../payment.model";

/** Datos de entrada de `POST /api/pagos`. */
export interface CreatePaymentDto {
  referencia_tipo: PaymentReferenceType;
  referencia_id: number;
  metodo: PaymentMethod;
  monto: number;
  /** Opcional: por defecto la fecha actual. */
  fecha?: string;
  /** Opcional: por defecto `PENDIENTE`. */
  estado?: PaymentState;
  /** Opcional: por defecto `true`. Tras crearlo, sólo cambia con el borrado lógico. */
  is_active?: boolean;
}
