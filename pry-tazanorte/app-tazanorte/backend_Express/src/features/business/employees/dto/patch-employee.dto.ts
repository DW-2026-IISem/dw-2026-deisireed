import { UpdateEmployeeDto } from "./update-employee.dto";

/** Datos de entrada de `PATCH /api/empleados/:id` (actualización parcial). */
export type PatchEmployeeDto = Partial<UpdateEmployeeDto>;
