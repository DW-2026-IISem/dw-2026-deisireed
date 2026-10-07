import { SupplyOrderItem, SupplyOrderItemI } from "../supply-order-item.model";

export type SupplyOrderItemResponseDto = SupplyOrderItemI;

export function toSupplyOrderItemResponse(item: SupplyOrderItem): SupplyOrderItemResponseDto {
  return item.toJSON() as SupplyOrderItemI;
}
