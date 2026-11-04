import { Money, Timestamps } from './api.model';

/** Tabla `supplies` — /api/insumos */
export interface Supply extends Timestamps {
  id: number;
  codigo: string;
  nombre: string;
  unidad_medida: string;
  stock_minimo: Money;
  is_active: boolean;
}

export interface SupplyPayload {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  stock_minimo: number;
  is_active?: boolean;
}
