import { CashRegister } from "./cash-register.model";
import { Employee } from "../employees/employee.model";

// Norma FK: singular de la tabla referenciada + `_id`. Aquí el diagrama usa `empleado_id`.
CashRegister.belongsTo(Employee, {
  foreignKey: "empleado_id",
  as: "employee",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Employee.hasMany(CashRegister, {
  foreignKey: "empleado_id",
  as: "cash_registers",
});
