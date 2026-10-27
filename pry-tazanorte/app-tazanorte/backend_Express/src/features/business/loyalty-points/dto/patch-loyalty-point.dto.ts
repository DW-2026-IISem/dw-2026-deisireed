import { UpdateLoyaltyPointDto } from "./update-loyalty-point.dto";

/** Datos de entrada de `PATCH /api/puntos-fidelizacion/:id` (actualización parcial). */
export type PatchLoyaltyPointDto = Partial<UpdateLoyaltyPointDto>;
