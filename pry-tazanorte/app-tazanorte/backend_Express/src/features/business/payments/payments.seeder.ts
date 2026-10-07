import { faker } from "@faker-js/faker";
import { Payment } from "./payment.model";

export const seedPayments = async (count: number = 10) => {
  const metodos = ["EFECTIVO", "TARJETA", "TRANSFERENCIA", "NEQUI"];
  const estados = ["COMPLETADO", "PENDIENTE", "CANCELADO"];

  for (let i = 0; i < count; i++) {
    await Payment.create({
      referencia_tipo: "PEDIDO",
      referencia_id: faker.number.int({ min: 1, max: 20 }),
      metodo: faker.helpers.arrayElement(metodos),
      monto: faker.number.float({ min: 5000, max: 100000, multipleOf: 100 }),
      fecha: faker.date.recent(),
      estado: faker.helpers.arrayElement(estados),
    });
  }
  console.log(`[SEED] ${count} pagos creados.`);
};
