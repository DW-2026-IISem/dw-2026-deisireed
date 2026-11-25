import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccessPayload,
  LoginRequest,
  PermissionsPayload,
  ProfilePayload,
  SessionTokens,
} from '../models/auth.model';
import { SessionStore } from './session-store';

/**
 * | Endpoint                   | Modalidad | Devuelve          |
 * |----------------------------|-----------|-------------------|
 * | POST /api/sesion/login     | OPEN      | SessionTokens     |
 * | GET  /api/sesion/perfil    | JWT       | { user }          |
 * | GET  /api/permisos         | JWT       | { permissions }   |
 * | POST /api/sesion/refresh   | OPEN      | SessionTokens     |
 * | POST /api/sesion/logout    | OPEN      | { message }       |
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);
  private readonly base = `${environment.apiUrl}/sesion`;
  private readonly permissionsUrl = `${environment.apiUrl}/permisos`;

  /** Login → guarda tokens → carga perfil + permisos. No emite hasta tener todo. */
  login(credentials: LoginRequest): Observable<AccessPayload> {
    return this.http.post<SessionTokens>(`${this.base}/login`, credentials).pipe(
      tap((tokens) => this.session.setTokens(tokens)),
      switchMap(() =>
        this.me().pipe(
          catchError((error: unknown) => {
            this.session.clear();
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  me(): Observable<AccessPayload> {
    return forkJoin({
      profile: this.http.get<ProfilePayload>(`${this.base}/perfil`),
      permissions: this.http.get<PermissionsPayload>(this.permissionsUrl),
    }).pipe(
      map(({ profile, permissions }) => ({
        user: profile.user,
        permissions: permissions.permissions,
      })),
      tap((access) => this.session.setAccess(access)),
    );
  }

  refresh(): Observable<SessionTokens> {
    const refresh_token = this.session.refreshToken();
    if (!refresh_token) {
      return throwError(() => new Error('No hay refresh token en la sesión'));
    }
    return this.http
      .post<SessionTokens>(`${this.base}/refresh`, { refresh_token })
      .pipe(tap((tokens) => this.session.setTokens(tokens)));
  }

  /** Siempre limpia el estado local, aunque el backend falle. */
  logout(): Observable<unknown> {
    const refresh_token = this.session.refreshToken();
    return this.http.post(`${this.base}/logout`, { refresh_token }).pipe(
      catchError(() => of(null)),
      finalize(() => this.session.clear()),
    );
  }
}
