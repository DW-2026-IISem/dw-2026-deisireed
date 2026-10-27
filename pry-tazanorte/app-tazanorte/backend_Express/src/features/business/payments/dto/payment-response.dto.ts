import { Payment, PaymentI } from "../payment.model";

/** Respuesta HTTP de un pago. `monto` se entrega como número. */
export type PaymentResponseDto = PaymentI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toPaymentResponse(payment: Payment): PaymentResponseDto {
  const json = payment.toJSON() as PaymentI;
  return { ...json, monto: Number(json.monto) };
}
