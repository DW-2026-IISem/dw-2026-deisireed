import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CashRegister, CashRegisterPayload } from '../../core/models/cash-register.model';

@Injectable({ providedIn: 'root' })
export class CashRegisterApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/turnos-caja`;

  list(): Observable<CashRegister[]> {
    return this.http
      .get<{ cash_registers: CashRegister[] }>(this.base)
      .pipe(map((response) => response.cash_registers));
  }

  get(id: number): Observable<CashRegister> {
    return this.http
      .get<{ cash_register: CashRegister }>(`${this.base}/${id}`)
      .pipe(map((response) => response.cash_register));
  }

  create(payload: CashRegisterPayload): Observable<CashRegister> {
    return this.http
      .post<{ cash_register: CashRegister }>(this.base, payload)
      .pipe(map((response) => response.cash_register));
  }

  update(id: number, payload: Partial<Omit<CashRegisterPayload, 'is_active'>>): Observable<CashRegister> {
    return this.http
      .patch<{ cash_register: CashRegister }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.cash_register));
  }

  replace(id: number, payload: Omit<CashRegisterPayload, 'is_active'>): Observable<CashRegister> {
    return this.http
      .put<{ cash_register: CashRegister }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.cash_register));
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
