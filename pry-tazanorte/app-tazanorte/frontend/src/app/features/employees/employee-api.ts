import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, EmployeePayload } from '../../core/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/empleados`;

  list(): Observable<Employee[]> {
    return this.http
      .get<{ employees: Employee[] }>(this.base)
      .pipe(map((response) => response.employees));
  }

  get(id: number): Observable<Employee> {
    return this.http
      .get<{ employee: Employee }>(`${this.base}/${id}`)
      .pipe(map((response) => response.employee));
  }

  create(payload: EmployeePayload): Observable<Employee> {
    return this.http
      .post<{ employee: Employee }>(this.base, payload)
      .pipe(map((response) => response.employee));
  }

  update(id: number, payload: Partial<Omit<EmployeePayload, 'is_active'>>): Observable<Employee> {
    return this.http
      .patch<{ employee: Employee }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.employee));
  }

  replace(id: number, payload: Omit<EmployeePayload, 'is_active'>): Observable<Employee> {
    return this.http
      .put<{ employee: Employee }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.employee));
  }

  /** Baja lógica: is_active = false. */
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Baja física: DELETE. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
