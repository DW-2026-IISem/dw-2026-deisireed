import { SupplyOrderItem } from "./supply-order-item.model";

export const seedSupplyOrderItems = async (): Promise<void> => {
  try {
    const items = [
      { orderItemId: 1, supplyId: 1, quantityUsed: 0.50 },
      { orderItemId: 1, supplyId: 2, quantityUsed: 0.20 },
      { orderItemId: 2, supplyId: 3, quantityUsed: 1.00 },
    ];

    await SupplyOrderItem.bulkCreate(items, { ignoreDuplicates: true });
    console.log("🌱 [ISS-11] Seeder de SupplyOrderItems ejecutado correctamente.");
  } catch (error) {
    console.error("❌ [ISS-11] Error al ejecutar Seeder de SupplyOrderItems:", error);
  }
};
