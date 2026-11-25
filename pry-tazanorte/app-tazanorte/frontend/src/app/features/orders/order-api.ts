import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderItem } from '../../core/models/order-item.model';
import {
  CashRegisterRef,
  ClientRef,
  Order,
  OrderCreatePayload,
  OrderState,
  OrderUpdatePayload,
  ProductRef,
} from '../../core/models/order.model';

/** /api/pedidos — POST es transaccional (cabecera + líneas). */
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

  /** Devuelve `{ order, items }`; el pedido nace en estado `pendiente`. */
  create(payload: OrderCreatePayload): Observable<{ order: Order; items: OrderItem[] }> {
    return this.http.post<{ order: Order; items: OrderItem[] }>(this.base, payload);
  }

  /** Solo cabecera y solo mientras esté `pendiente`. */
  update(id: number, payload: OrderUpdatePayload): Observable<Order> {
    return this.http
      .patch<{ order: Order }>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.order));
  }

  changeState(id: number, estado: OrderState): Observable<Order> {
    return this.http
      .patch<{ order: Order }>(`${this.base}/${id}/estado`, { estado })
      .pipe(map((r) => r.order));
  }

  /** Cancelación: estado = cancelado y desactiva sus líneas. */
  cancel(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Solo pedidos pendiente o cancelado. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}

/** Catálogos de solo lectura usados por pedidos y dashboard. */
@Injectable({ providedIn: 'root' })
export class OrderCatalogApi {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  clients(): Observable<ClientRef[]> {
    return this.http
      .get<{ clients: ClientRef[] }>(`${this.api}/clientes`)
      .pipe(map((r) => r.clients));
  }

  products(): Observable<ProductRef[]> {
    return this.http
      .get<{ products: ProductRef[] }>(`${this.api}/productos`)
      .pipe(map((r) => r.products));
  }

  cashRegisters(): Observable<CashRegisterRef[]> {
    return this.http
      .get<{ cash_registers: CashRegisterRef[] }>(`${this.api}/turnos-caja`)
      .pipe(map((r) => r.cash_registers));
  }
}
