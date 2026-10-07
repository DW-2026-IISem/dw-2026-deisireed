import { faker } from "@faker-js/faker";
import { CashRegister } from "./cash-register.model";
import { Employee } from "../employees/employee.model";

const TURNOS = [
  { nombre: "Turno mañana", descripcion: "6:00 a 14:00" },
  { nombre: "Turno tarde", descripcion: "14:00 a 22:00" },
  { nombre: "Turno noche", descripcion: "22:00 a 6:00" },
];

/**
 * Seeder del feature CashRegister (TurnoCaja).
 * Requiere empleados activos (se siembra después de `employees`).
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedCashRegisters(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  cash_registers: count=0, se omite");
    return 0;
  }

  const existing = await CashRegister.count();
  if (existing > 0) {
    console.log(`⏭️  cash_registers: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const employees = await Employee.findAll({ where: { is_active: true } });
  if (employees.length === 0) {
    console.log("⏭️  cash_registers: faltan empleados activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const turno = faker.helpers.arrayElement(TURNOS);
    const employee = faker.helpers.arrayElement(employees);
    return {
      nombre: turno.nombre,
      descripcion: turno.descripcion,
      empleado_id: employee.id,
      is_active: true,
    };
  });

  await CashRegister.bulkCreate(rows, { validate: true });
  console.log(`✅ cash_registers: insertados ${count} registro(s) falsos`);
  return count;
}
