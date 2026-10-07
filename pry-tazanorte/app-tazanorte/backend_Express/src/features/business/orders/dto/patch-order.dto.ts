import { UpdateOrderDto } from "./update-order.dto";

/** Datos de entrada de `PATCH /api/pedidos/:id` (actualización parcial de la cabecera). */
export type PatchOrderDto = Partial<UpdateOrderDto>;
