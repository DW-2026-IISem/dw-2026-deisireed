import { UpdateOrderItemDto } from "./update-order-item.dto";

/** Datos de entrada de `PATCH /api/detalle-pedidos/:id` (actualización parcial). */
export type PatchOrderItemDto = Partial<UpdateOrderItemDto>;
