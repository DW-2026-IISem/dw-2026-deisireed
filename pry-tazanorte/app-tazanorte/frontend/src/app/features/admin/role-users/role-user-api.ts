import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleUser } from '../../../core/models/role-user.model';

/** /api/asignaciones-rol — sin DELETE: retirar = deactivate, volver = reactivate. */
@Injectable({ providedIn: 'root' })
export class RoleUserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/asignaciones-rol`;

  list(): Observable<RoleUser[]> {
    return this.http.get<{ assignments: RoleUser[] }>(this.base).pipe(map((r) => r.assignments));
  }

  /** Create-or-reactivate: si la fila existía inactiva, el backend la reactiva. */
  create(payload: { user_id: number; role_id: number }): Observable<RoleUser> {
    return this.http
      .post<{ message: string; assignment: RoleUser }>(this.base, payload)
      .pipe(map((r) => r.assignment));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}
