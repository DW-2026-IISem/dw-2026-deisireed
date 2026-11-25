import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoyaltyPoint, LoyaltyPointPayload } from '../../core/models/loyalty-point.model';

/** GET /api/puntos-fidelizacion/cliente/:id/saldo */
export interface LoyaltyBalance {
  cliente_id: number;
  acumulados: number;
  redimidos: number;
  saldo: number;
}

/** 1 punto por cada $1.000 de un pedido pagado (PESOS_PER_POINT del backend). */
export const PESOS_PER_POINT = 1000;

@Injectable({ providedIn: 'root' })
export class LoyaltyPointApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/puntos-fidelizacion`;

  list(): Observable<LoyaltyPoint[]> {
    return this.http
      .get<{ loyalty_points: LoyaltyPoint[] }>(this.base)
      .pipe(map((r) => r.loyalty_points));
  }

  balance(clienteId: number): Observable<LoyaltyBalance> {
    return this.http
      .get<{ balance: LoyaltyBalance }>(`${this.base}/cliente/${clienteId}/saldo`)
      .pipe(map((r) => r.balance));
  }

  /** El backend calcula la cantidad en una acumulación; en redención se envía. */
  create(payload: LoyaltyPointPayload): Observable<LoyaltyPoint> {
    return this.http
      .post<{ loyalty_point: LoyaltyPoint }>(this.base, payload)
      .pipe(map((r) => r.loyalty_point));
  }

  /** Solo observaciones: el movimiento es historial. */
  update(id: number, payload: { observaciones: string | null }): Observable<LoyaltyPoint> {
    return this.http
      .patch<{ loyalty_point: LoyaltyPoint }>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.loyalty_point));
  }

  /** Anular movimiento (no permitido si sus puntos ya se redimieron). */
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
