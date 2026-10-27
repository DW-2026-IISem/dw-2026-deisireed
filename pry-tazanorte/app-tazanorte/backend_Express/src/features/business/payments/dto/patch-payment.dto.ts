import { UpdatePaymentDto } from "./update-payment.dto";

/** Datos de entrada de `PATCH /api/pagos/:id` (actualización parcial). */
export type PatchPaymentDto = Partial<UpdatePaymentDto>;
