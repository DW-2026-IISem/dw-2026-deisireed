import { SupplyOrderItem } from "../../features/business/supply-order-items/supply-order-item.model";

export async function seedSupplyOrderItems(): Promise<void> {
  try {
    await SupplyOrderItem.bulkCreate([
      { orderItemId: 1, supplyId: 1, quantityUsed: 0.50 },
      { orderItemId: 1, supplyId: 2, quantityUsed: 0.20 },
    ], { ignoreDuplicates: true });
    console.log("🌱 Seeder ISS-11 (SupplyOrderItems) ejecutado con éxito.");
  } catch (error) {
    console.error("❌ Error en seeder ISS-11:", error);
  }
}
