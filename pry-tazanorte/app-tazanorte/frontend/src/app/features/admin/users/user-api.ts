import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EffectivePermission, PermissionsPayload } from '../../../core/models/auth.model';
import { User, UserPayload } from '../../../core/models/user.model';

/** /api/usuarios — PATCH solo acepta username, email y avatar. */
@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/usuarios`;

  list(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(this.base).pipe(map((r) => r.users));
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<{ user: User }>(this.base, payload).pipe(map((r) => r.user));
  }

  update(id: number, payload: Partial<UserPayload>): Observable<User> {
    return this.http.patch<{ user: User }>(`${this.base}/${id}`, payload).pipe(map((r) => r.user));
  }

  /** Misma consulta que usa `authorize`: diagnostica cualquier 403. */
  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<PermissionsPayload>(`${this.base}/${id}/permisos`)
      .pipe(map((r) => r.permissions));
  }

  /** Exige la contraseña actual: es autoservicio, no reseteo de admin. */
  changePassword(id: number, payload: { current_password: string; new_password: string }): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/password`, payload);
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
