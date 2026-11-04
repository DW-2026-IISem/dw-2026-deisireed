import { Money, Timestamps } from './api.model';

/** Tabla `products` — /api/productos */
export interface Product extends Timestamps {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precio: Money; // DECIMAL → puede llegar como string
  is_active: boolean;
}

export interface ProductPayload {
  sku: string;
  nombre: string;
  descripcion?: string | null;
  precio: number; // al escribir siempre es number
  is_active?: boolean;
}
