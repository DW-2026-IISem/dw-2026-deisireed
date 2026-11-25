import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OrderItem,
  OrderItemCreatePayload,
  OrderItemUpdatePayload,
} from '../../core/models/order-item.model';

/** /api/detalle-pedidos — cada cambio recalcula subtotal/total del pedido (solo si está pendiente). */
@Injectable({ providedIn: 'root' })
export class OrderItemApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/detalle-pedidos`;

  list(): Observable<OrderItem[]> {
    return this.http.get<{ order_items: OrderItem[] }>(this.base).pipe(map((r) => r.order_items));
  }

  create(payload: OrderItemCreatePayload): Observable<OrderItem> {
    return this.http.post<{ order_item: OrderItem }>(this.base, payload).pipe(map((r) => r.order_item));
  }

  /** PATCH acepta `cantidad` y `observaciones`; el estado solo cambia con `/deactivate`. */
  update(id: number, payload: OrderItemUpdatePayload): Observable<OrderItem> {
    return this.http
      .patch<{ order_item: OrderItem }>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.order_item));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
