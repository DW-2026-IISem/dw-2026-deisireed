import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { HttpMethod } from '../models/resource.model';
import { User } from '../models/user.model';

const STORAGE_KEY = 'tazanorte.session.v1';

interface PersistedSession {
  accessToken: string;
  refreshToken: string;
  user: User | null;
  permissions: EffectivePermission[];
}

/**
 * Única fuente de verdad de la sesión en el cliente (signals de solo lectura).
 * El backend sigue siendo la autoridad: `can()` solo decide qué pintar.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  readonly authEnabled = environment.requireAuth;

  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _permissions = signal<EffectivePermission[]>([]);

  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly user = this._user.asReadonly();
  readonly permissions = this._permissions.asReadonly();

  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  /** Roles derivados de los permisos efectivos (role_name único). */
  readonly roleNames = computed(() =>
    [...new Set(this._permissions().map((p) => p.role_name))].sort(),
  );

  readonly permissionCount = computed(() => this._permissions().length);

  readonly initials = computed(() => (this._user()?.username ?? '??').slice(0, 2).toUpperCase());

  readonly roleLabel = computed(() => this.roleNames().join(' · ') || 'Sin rol');

  constructor() {
    this.restore();
  }

  setTokens(tokens: SessionTokens): void {
    this._accessToken.set(tokens.access_token);
    this._refreshToken.set(tokens.refresh_token);
    this.persist();
  }

  setAccess(access: AccessPayload): void {
    this._user.set(access.user);
    this._permissions.set(access.permissions ?? []);
    this.persist();
  }

  clear(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    this._permissions.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  /** ¿La sesión tiene el permiso MÉTODO + path? Soporta `:id` del catálogo. */
  can(method: HttpMethod | string, path: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const verb = method.toUpperCase();
    const requestPath = path.split('?')[0];
    return this._permissions().some((p) => p.method === verb && pathMatches(p.path, requestPath));
  }

  /** Igual que `can`, con el formato "GET /api/clientes". */
  canPermission(permission: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const separator = permission.indexOf(' ');
    if (separator < 0) {
      return false;
    }
    return this.can(permission.slice(0, separator), permission.slice(separator + 1));
  }

  hasRole(name: string): boolean {
    return this.roleNames().includes(name.toUpperCase());
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const data = JSON.parse(raw) as PersistedSession;
      if (!data.accessToken || !Array.isArray(data.permissions)) {
        this.clear();
        return;
      }
      this._accessToken.set(data.accessToken);
      this._refreshToken.set(data.refreshToken || null);
      this._user.set(data.user ?? null);
      this._permissions.set(data.permissions);
    } catch {
      this.clear();
    }
  }

  private persist(): void {
    const data: PersistedSession = {
      accessToken: this._accessToken() ?? '',
      refreshToken: this._refreshToken() ?? '',
      user: this._user(),
      permissions: this._permissions(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* modo privado o cuota llena: la sesión sigue en memoria */
    }
  }
}

/** `/api/usuarios/:id` debe reconocer `/api/usuarios/7`. */
function pathMatches(pattern: string, path: string): boolean {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\/:[^/]+/g, '/[^/]+');
  return new RegExp(`^${escaped}$`).test(path);
}
