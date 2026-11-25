import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { toNumber } from '../../../core/models/api.model';
import { LoyaltyMovementType, LoyaltyPoint } from '../../../core/models/loyalty-point.model';
import { ClientRef, Order } from '../../../core/models/order.model';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { OrderApi, OrderCatalogApi } from '../../orders/order-api';
import { LoyaltyBalance, LoyaltyPointApi, PESOS_PER_POINT } from '../loyalty-point-api';

/** Estados de pedido que generan puntos (ORDER_STATES_THAT_EARN del backend). */
const EARN_STATES = ['pagado', 'en_preparacion', 'entregado'];
const BALANCE = 'GET /api/puntos-fidelizacion/cliente/:id/saldo';

/** Movimientos de puntos (/api/puntos-fidelizacion). CAJA acumula/redime; SUPERVISOR anula. */
@Component({
  host: { class: 'block' },
  selector: 'app-loyalty-point-list',
  imports: [
    DatePipe, FormsModule, ButtonModule, DialogModule, EmptyState, HasPermission, InputNumberModule, InputTextModule,
    MessageModule, PageHeader, SelectButtonModule, SelectModule, StatusTag, TableModule, TagModule, TooltipModule,
  ],
  templateUrl: './loyalty-point-list.html',
  styleUrl: './loyalty-point-list.css',
})
export class LoyaltyPointList {
  private readonly api = inject(LoyaltyPointApi);
  private readonly ordersApi = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<LoyaltyPoint[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly clients = signal<ClientRef[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly clientFilter = signal<number | null>(null);
  readonly balance = signal<LoyaltyBalance | null>(null);

  readonly typeOptions = [
    { label: 'Acumular', value: 'acumulacion' },
    { label: 'Redimir', value: 'redencion' },
  ];

  readonly orderById = computed(() => new Map(this.orders().map((o) => [o.id, o])));
  readonly clientName = computed(() => {
    const map = new Map(this.clients().map((c) => [c.id, c.nombre]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  readonly visibleRows = computed(() => {
    const client = this.clientFilter();
    return [...this.rows()]
      .filter((r) => !client || r.cliente_id === client)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  // Diálogo «Movimiento»
  readonly dialogVisible = signal(false);
  readonly type = signal<LoyaltyMovementType>('acumulacion');
  readonly clientId = signal<number | null>(null);
  readonly orderId = signal<number | null>(null);
  readonly quantity = signal<number>(1);
  readonly note = signal('');
  readonly dialogBalance = signal<LoyaltyBalance | null>(null);
  readonly formError = signal<string | null>(null);

  /** Pedidos que ya acumularon (activos): no se repiten. */
  private readonly accumulated = computed(
    () => new Set(this.rows().filter((r) => r.is_active && r.tipo === 'acumulacion').map((r) => r.pedido_id)),
  );

  /** Pedidos pagados del cliente elegido que todavía no acumularon. */
  readonly earnableOrders = computed(() => {
    const client = this.clientId();
    return this.orders()
      .filter((o) => o.cliente_id === client && EARN_STATES.includes(o.estado) && !this.accumulated().has(o.id))
      .map((o) => ({ id: o.id, label: `#${o.id} · ${this.pointsFor(o)} puntos` }));
  });

  readonly preview = computed(() => {
    if (this.type() === 'redencion') return -Number(this.quantity() || 0);
    const order = this.orderById().get(this.orderId() ?? 0);
    return order ? this.pointsFor(order) : 0;
  });

  constructor() {
    this.load();
  }

  load(): void {
    const can = (p: string) => this.session.canPermission(p);
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      rows: this.api.list(),
      orders: can('GET /api/pedidos') ? this.ordersApi.list() : of([] as Order[]),
      clients: can('GET /api/clientes') ? this.catalog.clients() : of([] as ClientRef[]),
    }).subscribe({
      next: ({ rows, orders, clients }) => {
        this.rows.set(rows);
        this.orders.set(orders);
        this.clients.set(clients);
        this.loading.set(false);
        this.refreshBalance();
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  pointsFor(order: Order): number {
    return Math.floor(toNumber(order.total) / PESOS_PER_POINT);
  }

  filterClient(id: number | null): void {
    this.clientFilter.set(id);
    this.refreshBalance();
  }

  private refreshBalance(): void {
    const id = this.clientFilter();
    this.balance.set(null);
    if (id && this.session.canPermission(BALANCE)) {
      this.api.balance(id).subscribe({ next: (b) => this.balance.set(b) });
    }
  }

  openCreate(): void {
    this.type.set('acumulacion');
    this.selectClient(this.clientFilter());
    this.quantity.set(1);
    this.note.set('');
    this.formError.set(null);
    this.dialogVisible.set(true);
  }

  selectClient(id: number | null): void {
    this.clientId.set(id);
    this.orderId.set(null);
    this.dialogBalance.set(null);
    if (id && this.session.canPermission(BALANCE)) {
      this.api.balance(id).subscribe({ next: (b) => this.dialogBalance.set(b) });
    }
  }

  save(): void {
    const cliente_id = this.clientId();
    const tipo = this.type();
    if (cliente_id === null) {
      this.formError.set('Selecciona el cliente.');
      return;
    }
    if (tipo === 'acumulacion' && this.orderId() === null) {
      this.formError.set('Selecciona un pedido pagado del cliente.');
      return;
    }
    if (tipo === 'redencion' && (!Number.isInteger(this.quantity()) || this.quantity() < 1)) {
      this.formError.set('La cantidad a redimir debe ser un entero de al menos 1.');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    this.api
      .create({
        cliente_id,
        tipo,
        ...(tipo === 'acumulacion' ? { pedido_id: this.orderId() } : { cantidad: this.quantity() }),
        observaciones: this.note().trim() || null,
      })
      .subscribe({
        next: (point) => {
          this.saving.set(false);
          this.dialogVisible.set(false);
          this.notify.success(
            tipo === 'acumulacion' ? `+${point.cantidad} puntos acumulados` : `${point.cantidad} puntos redimidos`,
            this.clientName()(cliente_id),
          );
          this.load();
        },
        error: (error: unknown) => {
          this.saving.set(false);
          this.formError.set(toApiMessage(error));
        },
      });
  }

  annul(row: LoyaltyPoint): void {
    this.confirmation.confirm({
      header: 'Anular movimiento',
      message: `¿Anular ${row.cantidad} puntos de ${this.clientName()(row.cliente_id)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Anular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () =>
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Movimiento anulado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo anular', toApiMessage(error)),
        }),
    });
  }

  remove(row: LoyaltyPoint): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el movimiento #${row.id}. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Movimiento eliminado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        }),
    });
  }
}
