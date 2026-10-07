import { Employee, EmployeeI } from "../employee.model";

/** Respuesta HTTP de un empleado. No hay campos internos que ocultar. */
export type EmployeeResponseDto = EmployeeI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toEmployeeResponse(employee: Employee): EmployeeResponseDto {
  return employee.toJSON() as EmployeeResponseDto;
}
