import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';
import { ClientRef, Order, OrderState, ProductRef } from '../../core/models/order.model';
import { ORDER_STATE_LABEL, httpMessage, orderSeverity, toNumber } from '../../core/utils/order-utils';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { OrderApi, OrderCatalogApi } from '../orders/order-api';

const PAID_STATES: OrderState[] = ['pagado', 'en_preparacion', 'entregado'];

/**
 * Panel: 3 peticiones en paralelo (forkJoin) y todo lo demás es `computed`.
 * La API entrega datos crudos; los indicadores se derivan en el cliente.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ButtonModule,
    CardModule,
    MessageModule,
    PageHeader,
    SkeletonModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly ordersApi = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly clients = signal<ClientRef[]>([]);
  readonly products = signal<ProductRef[]>([]);
  readonly orders = signal<Order[]>([]);

  readonly severity = orderSeverity;

  /** Pedidos por atender (sustituye al «stock bajo» de la guía). */
  readonly pending = computed(() => this.orders().filter((o) => o.estado === 'pendiente'));

  readonly paid = computed(() => this.orders().filter((o) => PAID_STATES.includes(o.estado)));

  /** Ingresos = pedidos pagados, en preparación o entregados. */
  readonly revenue = computed(() =>
    this.paid().reduce((sum, order) => sum + toNumber(order.total), 0),
  );

  readonly avgTicket = computed(() =>
    this.paid().length ? this.revenue() / this.paid().length : 0,
  );

  readonly latestOrders = computed(() =>
    [...this.orders()]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5),
  );

  readonly productName = computed(() => {
    const map = new Map(this.products().map((p) => [p.id, p.nombre]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly clientName = computed(() => {
    const map = new Map(this.clients().map((c) => [c.id, c.nombre]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  /** Top 5 por unidades (líneas activas de pedidos no cancelados). */
  readonly topProducts = computed(() => {
    const totals = new Map<number, number>();
    for (const order of this.orders()) {
      for (const item of order.items ?? []) {
        if (item.is_active) {
          totals.set(item.producto_id, (totals.get(item.producto_id) ?? 0) + item.cantidad);
        }
      }
    }
    return [...totals.entries()]
      .map(([producto_id, cantidad]) => ({ producto_id, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  });

  constructor() {
    this.load();
  }

  stateText(state: OrderState): string {
    return ORDER_STATE_LABEL[state];
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      clients: this.catalog.clients(),
      products: this.catalog.products(),
      orders: this.ordersApi.list(),
    }).subscribe({
      next: ({ clients, products, orders }) => {
        this.clients.set(clients);
        this.products.set(products);
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(httpMessage(error));
        this.loading.set(false);
      },
    });
  }
}
