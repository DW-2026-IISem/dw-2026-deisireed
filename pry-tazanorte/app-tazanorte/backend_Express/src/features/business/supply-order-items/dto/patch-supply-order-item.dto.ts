import { UpdateSupplyOrderItemDto } from "./update-supply-order-item.dto";

/** Datos de entrada de `PATCH /api/insumo-pedido-detalles/:id` (actualización parcial). */
export type PatchSupplyOrderItemDto = Partial<UpdateSupplyOrderItemDto>;
