import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderItem, OrderItemPayload } from '../../core/models/order-item.model';

@Injectable({ providedIn: 'root' })
export class OrderItemApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/detalle-pedidos`;

  list(): Observable<OrderItem[]> {
    return this.http
      .get<{ order_items: OrderItem[] }>(this.base)
      .pipe(map((response) => response.order_items));
  }

  get(id: number): Observable<OrderItem> {
    return this.http
      .get<{ order_item: OrderItem }>(`${this.base}/${id}`)
      .pipe(map((response) => response.order_item));
  }

  create(payload: OrderItemPayload): Observable<OrderItem> {
    return this.http
      .post<{ order_item: OrderItem }>(this.base, payload)
      .pipe(map((response) => response.order_item));
  }

  update(id: number, payload: Partial<Omit<OrderItemPayload, 'is_active'>>): Observable<OrderItem> {
    return this.http
      .patch<{ order_item: OrderItem }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.order_item));
  }

  replace(id: number, payload: Omit<OrderItemPayload, 'is_active'>): Observable<OrderItem> {
    return this.http
      .put<{ order_item: OrderItem }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.order_item));
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
