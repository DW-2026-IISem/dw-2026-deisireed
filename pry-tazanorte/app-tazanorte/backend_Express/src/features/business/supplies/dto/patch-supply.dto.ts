import { UpdateSupplyDto } from "./update-supply.dto";

/** Datos de entrada de `PATCH /api/insumos/:id` (actualización parcial). */
export type PatchSupplyDto = Partial<UpdateSupplyDto>;
