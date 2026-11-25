import { HasPermission } from '../../../shared/directives/has-permission';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { SessionStore } from '../../../core/services/session-store';
import { ClientRef, Order, OrderState, ProductRef } from '../../../core/models/order.model';
import { NotificationService } from '../../../core/services/notification';
import { filterRows } from '../../../core/utils/filter-rows';
import {
  ORDER_NEXT_STATES,
  ORDER_STATE_LABEL,
  httpMessage,
  orderSeverity,
} from '../../../core/utils/order-utils';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { OrderDetail } from '../order-detail/order-detail';
import { OrderApi, OrderCatalogApi } from '../order-api';

/** Listado de pedidos: ver detalle, avanzar estado, cancelar y eliminar. */
@Component({
  host: { class: 'block' },
  selector: 'app-order-list',
  imports: [
    HasPermission,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    TableModule,
    TagModule,
    TooltipModule,
    OrderDetail,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList {
  private readonly api = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly orders = signal<Order[]>([]);
  readonly clients = signal<ClientRef[]>([]);
  readonly products = signal<ProductRef[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly selected = signal<Order | null>(null);
  readonly detailVisible = signal(false);
  readonly detailTitle = computed(() => `Pedido #${this.selected()?.id ?? ''}`);

  readonly severity = orderSeverity;

  readonly clientName = computed(() => {
    const map = new Map(this.clients().map((client) => [client.id, client.nombre]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.orders(), this.filter(), (order) => [
      order.id,
      this.clientName()(order.cliente_id),
      ORDER_STATE_LABEL[order.estado],
    ]),
  );

  readonly pendingCount = computed(
    () => this.orders().filter((order) => order.estado === 'pendiente').length,
  );

  constructor() {
    this.load();
  }

  stateText(state: OrderState): string {
    return ORDER_STATE_LABEL[state];
  }

  availableNext(state: OrderState): OrderState[] {
    return ORDER_NEXT_STATES[state];
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      orders: this.api.list(),
      clients: this.session.canPermission('GET /api/clientes') ? this.catalog.clients() : of([]),
      products: this.catalog.products(),
    }).subscribe({
      next: ({ orders, clients, products }) => {
        this.orders.set(orders);
        this.clients.set(clients);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.orders.set([]);
        this.error.set(httpMessage(error));
        this.loading.set(false);
      },
    });
  }

  units(order: Order): number {
    return (order.items ?? [])
      .filter((item) => item.is_active)
      .reduce((sum, item) => sum + item.cantidad, 0);
  }

  openDetail(order: Order): void {
    this.selected.set(order);
    this.detailVisible.set(true);
  }

  advance(order: Order, estado: OrderState): void {
    this.api.changeState(order.id, estado).subscribe({
      next: () => {
        this.notify.success(`Pedido #${order.id}: ${this.stateText(estado)}`);
        this.load();
      },
      error: (error: unknown) => this.notify.error('No se pudo cambiar el estado', httpMessage(error)),
    });
  }

  /** Baja lógica = cancelación: estado `cancelado` y líneas inactivas. */
  cancel(order: Order): void {
    this.confirmation.confirm({
      header: 'Cancelar pedido',
      message: `¿Cancelar el pedido #${order.id}? Sus líneas quedarán inactivas.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar pedido',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.cancel(order.id).subscribe({
          next: () => {
            this.notify.warn(`Pedido #${order.id} cancelado`);
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo cancelar', httpMessage(error)),
        });
      },
    });
  }

  /** Baja física: el backend solo la permite en `pendiente` o `cancelado`. */
  remove(order: Order): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el pedido #${order.id} y sus líneas. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(order.id).subscribe({
          next: () => {
            this.notify.success(`Pedido #${order.id} eliminado`);
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', httpMessage(error)),
        });
      },
    });
  }
}
