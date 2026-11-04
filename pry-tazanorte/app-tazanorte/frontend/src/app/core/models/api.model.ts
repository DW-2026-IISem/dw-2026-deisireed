/** Estado de las tablas de seguridad (users, roles, resources…). */
export type Status = 'active' | 'inactive';

/** DECIMAL(12,2) puede llegar como number o como string ("12.50"). */
export type Money = number | string;

export interface ApiError {
  error: string;
  detail?: string;
}

/** Firma mínima de los objetos Sequelize que devuelve el backend. */
export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export function toNumber(value: Money | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
