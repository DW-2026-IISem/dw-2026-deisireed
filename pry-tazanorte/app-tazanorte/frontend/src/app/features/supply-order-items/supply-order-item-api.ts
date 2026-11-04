import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupplyOrderItem, SupplyOrderItemPayload } from '../../core/models/supply-order-item.model';

@Injectable({ providedIn: 'root' })
export class SupplyOrderItemApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/insumo-pedido-detalles`;

  list(): Observable<SupplyOrderItem[]> {
    return this.http
      .get<{ supply_order_items: SupplyOrderItem[] }>(this.base)
      .pipe(map((response) => response.supply_order_items));
  }

  get(id: number): Observable<SupplyOrderItem> {
    return this.http
      .get<{ supply_order_item: SupplyOrderItem }>(`${this.base}/${id}`)
      .pipe(map((response) => response.supply_order_item));
  }

  create(payload: SupplyOrderItemPayload): Observable<SupplyOrderItem> {
    return this.http
      .post<{ supply_order_item: SupplyOrderItem }>(this.base, payload)
      .pipe(map((response) => response.supply_order_item));
  }

  update(id: number, payload: Partial<Omit<SupplyOrderItemPayload, 'is_active'>>): Observable<SupplyOrderItem> {
    return this.http
      .patch<{ supply_order_item: SupplyOrderItem }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.supply_order_item));
  }

  replace(id: number, payload: Omit<SupplyOrderItemPayload, 'is_active'>): Observable<SupplyOrderItem> {
    return this.http
      .put<{ supply_order_item: SupplyOrderItem }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.supply_order_item));
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
