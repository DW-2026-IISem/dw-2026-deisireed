import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderItem } from '../../core/models/order-item.model';
import {
  Order,
  OrderCreatePayload,
  OrderState,
  OrderUpdatePayload,
} from '../../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/pedidos`;

  list(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>(this.base).pipe(map((r) => r.orders));
  }

  get(id: number): Observable<Order> {
    return this.http.get<{ order: Order }>(`${this.base}/${id}`).pipe(map((r) => r.order));
  }

  /** POST devuelve { order, items }: los totales ya los calculó Express. */
  create(payload: OrderCreatePayload): Observable<{ order: Order; items: OrderItem[] }> {
    return this.http.post<{ order: Order; items: OrderItem[] }>(this.base, payload);
  }

  update(id: number, payload: Partial<OrderUpdatePayload>): Observable<Order> {
    return this.http
      .patch<{ order: Order }>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.order));
  }

  replace(id: number, payload: OrderUpdatePayload): Observable<Order> {
    return this.http.put<{ order: Order }>(`${this.base}/${id}`, payload).pipe(map((r) => r.order));
  }

  /** PATCH /api/pedidos/:id/estado — el estado no se cambia con PUT/PATCH normales. */
  changeState(id: number, estado: OrderState): Observable<Order> {
    return this.http
      .patch<{ order: Order }>(`${this.base}/${id}/estado`, { estado })
      .pipe(map((r) => r.order));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
