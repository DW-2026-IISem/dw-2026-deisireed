import { SupplyOrderItem, SupplyOrderItemI } from "../supply-order-item.model";

/** Respuesta HTTP de un consumo de insumo. `cantidad_usada` se entrega como número. */
export type SupplyOrderItemResponseDto = SupplyOrderItemI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toSupplyOrderItemResponse(item: SupplyOrderItem): SupplyOrderItemResponseDto {
  const json = item.toJSON() as SupplyOrderItemI;
  return { ...json, cantidad_usada: Number(json.cantidad_usada) };
}
