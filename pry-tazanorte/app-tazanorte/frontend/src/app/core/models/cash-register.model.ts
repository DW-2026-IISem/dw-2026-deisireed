import { Timestamps } from './api.model';

/** Tabla `cash_registers` — /api/turnos-caja */
export interface CashRegister extends Timestamps {
  id: number;
  nombre: string;
  descripcion: string | null;
  empleado_id: number;
  is_active: boolean;
}

export interface CashRegisterPayload {
  nombre: string;
  descripcion?: string | null;
  empleado_id: number;
  is_active?: boolean;
}
