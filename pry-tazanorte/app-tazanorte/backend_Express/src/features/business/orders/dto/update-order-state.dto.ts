import { OrderState } from "../order.model";

/** Datos de entrada de `PATCH /api/pedidos/:id/estado`. */
export interface UpdateOrderStateDto {
  estado: OrderState;
}
