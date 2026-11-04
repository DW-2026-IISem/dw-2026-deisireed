import { Status, Timestamps } from './api.model';

/** Tabla `users` — /api/usuarios. Nunca incluye `password`. */
export interface User extends Timestamps {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: Status;
}

export interface UserPayload {
  username: string;
  email: string;
  /** Obligatorio al crear; opcional al editar. */
  password?: string;
  avatar?: string | null;
  status?: Status;
}
