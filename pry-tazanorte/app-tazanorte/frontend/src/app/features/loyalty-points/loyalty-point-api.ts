import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoyaltyPoint, LoyaltyPointPayload } from '../../core/models/loyalty-point.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyPointApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/puntos-fidelizacion`;

  list(): Observable<LoyaltyPoint[]> {
    return this.http
      .get<{ loyalty_points: LoyaltyPoint[] }>(this.base)
      .pipe(map((response) => response.loyalty_points));
  }

  get(id: number): Observable<LoyaltyPoint> {
    return this.http
      .get<{ loyalty_point: LoyaltyPoint }>(`${this.base}/${id}`)
      .pipe(map((response) => response.loyalty_point));
  }

  create(payload: LoyaltyPointPayload): Observable<LoyaltyPoint> {
    return this.http
      .post<{ loyalty_point: LoyaltyPoint }>(this.base, payload)
      .pipe(map((response) => response.loyalty_point));
  }

  update(id: number, payload: Partial<Omit<LoyaltyPointPayload, 'is_active'>>): Observable<LoyaltyPoint> {
    return this.http
      .patch<{ loyalty_point: LoyaltyPoint }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.loyalty_point));
  }

  replace(id: number, payload: Omit<LoyaltyPointPayload, 'is_active'>): Observable<LoyaltyPoint> {
    return this.http
      .put<{ loyalty_point: LoyaltyPoint }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.loyalty_point));
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
