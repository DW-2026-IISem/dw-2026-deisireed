import { OrderChannel } from "../order.model";

/** Una línea (producto + cantidad) dentro del `POST /api/pedidos`. */
export interface OrderLineInputDto {
  producto_id: number;
  cantidad: number;
  observaciones?: string | null;
}

/**
 * Datos de entrada de `POST /api/pedidos` (cabecera + líneas, transaccional).
 * El estado inicial siempre es `pendiente`: no se acepta desde el cliente.
 * `subtotal` y `total` son derivados: los calcula el service.
 */
export interface CreateOrderDto {
  cliente_id: number;
  turno_caja_id: number;
  /** Opcional: por defecto `caja`. */
  canal?: OrderChannel;
  fecha?: Date | string;
  items: OrderLineInputDto[];
}
