import { seedPayments } from "../../features/business/payments/payments.seeder";

export const runSeeders = async () => {
  try {
    console.log("Iniciando Seeders...");
    await seedPayments(10);
    console.log("Seeders ejecutados correctamente.");
  } catch (error) {
    console.error("Error al ejecutar seeders:", error);
  }
};
