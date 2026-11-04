import { Timestamps } from './api.model';

/** Tabla `employees` — /api/empleados */
export interface Employee extends Timestamps {
  id: number;
  nombre: string;
  descripcion: string | null;
  is_active: boolean;
}

export interface EmployeePayload {
  nombre: string;
  descripcion?: string | null;
  is_active?: boolean;
}
