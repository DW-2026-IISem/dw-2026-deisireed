import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, PaymentPayload } from '../../core/models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/pagos`;

  list(): Observable<Payment[]> {
    return this.http
      .get<{ payments: Payment[] }>(this.base)
      .pipe(map((response) => response.payments));
  }

  get(id: number): Observable<Payment> {
    return this.http
      .get<{ payment: Payment }>(`${this.base}/${id}`)
      .pipe(map((response) => response.payment));
  }

  create(payload: PaymentPayload): Observable<Payment> {
    return this.http
      .post<{ payment: Payment }>(this.base, payload)
      .pipe(map((response) => response.payment));
  }

  update(id: number, payload: Partial<Omit<PaymentPayload, 'is_active'>>): Observable<Payment> {
    return this.http
      .patch<{ payment: Payment }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.payment));
  }

  replace(id: number, payload: Omit<PaymentPayload, 'is_active'>): Observable<Payment> {
    return this.http
      .put<{ payment: Payment }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.payment));
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
