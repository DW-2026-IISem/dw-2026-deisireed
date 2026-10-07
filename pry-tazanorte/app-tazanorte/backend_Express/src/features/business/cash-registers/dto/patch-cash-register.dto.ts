import { UpdateCashRegisterDto } from "./update-cash-register.dto";

/** Datos de entrada de `PATCH /api/turnos-caja/:id` (actualización parcial). */
export type PatchCashRegisterDto = Partial<UpdateCashRegisterDto>;
