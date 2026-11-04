import { Timestamps } from './api.model';

/** Tabla `clients` — /api/clientes */
export interface Client extends Timestamps {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  is_active: boolean;
}

export interface ClientPayload {
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  /** Solo al crear (por defecto true). Después solo cambia con /deactivate. */
  is_active?: boolean;
}
