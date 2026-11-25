import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { toNumber } from '../../../core/models/api.model';
import { ClientRef, Order } from '../../../core/models/order.model';
import {
  PAYMENT_METHODS,
  PAYMENT_STATES,
  Payment,
  PaymentMethod,
  PaymentState,
} from '../../../core/models/payment.model';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { ORDER_STATE_LABEL } from '../../../core/utils/order-utils';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { OrderApi, OrderCatalogApi } from '../../orders/order-api';
import { PaymentApi } from '../payment-api';

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
  NEQUI: 'Nequi',
};

const STATE_LABEL: Record<PaymentState, string> = {
  PENDIENTE: 'Pendiente',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Pagos de pedidos (/api/pagos). CAJA registra y cobra; SUPERVISOR confirma o anula. */
@Component({
  host: { class: 'block' },
  selector: 'app-payment-list',
  imports: [
    CurrencyPipe, DatePipe, FormsModule, ButtonModule, DialogModule, EmptyState, HasPermission, InputNumberModule,
    MessageModule, PageHeader, SelectButtonModule, SelectModule, TableModule, TagModule, TooltipModule,
  ],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
})
export class PaymentList {
  private readonly api = inject(PaymentApi);
  private readonly ordersApi = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<Payment[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly clients = signal<ClientRef[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly stateFilter = signal<PaymentState | null>(null);

  readonly methodOptions = PAYMENT_METHODS.map((m) => ({ label: METHOD_LABEL[m], value: m }));
  readonly stateOptions = PAYMENT_STATES.map((s) => ({ label: STATE_LABEL[s], value: s }));
  readonly methodLabel = METHOD_LABEL;
  readonly stateLabel = STATE_LABEL;

  methodText(method: PaymentMethod): string {
    return METHOD_LABEL[method];
  }

  stateText(state: PaymentState): string {
    return STATE_LABEL[state];
  }

  readonly orderById = computed(() => new Map(this.orders().map((o) => [o.id, o])));
  readonly clientName = computed(() => {
    const map = new Map(this.clients().map((c) => [c.id, c.nombre]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  readonly visibleRows = computed(() => {
    const state = this.stateFilter();
    return [...this.rows()]
      .filter((p) => !state || p.estado === state)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  readonly pendingCount = computed(() => this.rows().filter((p) => p.estado === 'PENDIENTE').length);
  readonly collected = computed(() =>
    this.rows().filter((p) => p.estado === 'COMPLETADO').reduce((sum, p) => sum + toNumber(p.monto), 0),
  );

  // Diálogo «Registrar pago»
  readonly dialogVisible = signal(false);
  readonly orderId = signal<number | null>(null);
  readonly method = signal<PaymentMethod>('EFECTIVO');
  readonly amount = signal<number>(0);
  readonly formError = signal<string | null>(null);

  /** Pendientes primero; nunca cancelados. */
  readonly orderOptions = computed(() =>
    this.orders()
      .filter((o) => o.estado !== 'cancelado')
      .sort((a, b) => Number(b.estado === 'pendiente') - Number(a.estado === 'pendiente') || b.id - a.id)
      .map((o) => ({
        id: o.id,
        label: `#${o.id} · ${this.clientName()(o.cliente_id)} · ${cop.format(toNumber(o.total))} · ${ORDER_STATE_LABEL[o.estado]}`,
      })),
  );

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
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  orderLabel(id: number): string {
    const order = this.orderById().get(id);
    return order ? `#${id} · ${this.clientName()(order.cliente_id)}` : `Pedido #${id}`;
  }

  stateSeverity(state: PaymentState): 'warn' | 'success' | 'danger' {
    return state === 'PENDIENTE' ? 'warn' : state === 'COMPLETADO' ? 'success' : 'danger';
  }

  openCreate(): void {
    this.orderId.set(null);
    this.method.set('EFECTIVO');
    this.amount.set(0);
    this.formError.set(null);
    this.dialogVisible.set(true);
  }

  /** Al elegir el pedido, el monto se propone con su total. */
  selectOrder(id: number | null): void {
    this.orderId.set(id);
    const order = id === null ? undefined : this.orderById().get(id);
    this.amount.set(order ? toNumber(order.total) : 0);
  }

  /** «Guardar pendiente» o «Cobrar» (COMPLETADO). */
  register(estado: PaymentState): void {
    const orderId = this.orderId();
    const monto = Number(this.amount());
    if (orderId === null) {
      this.formError.set('Selecciona el pedido.');
      return;
    }
    if (!Number.isFinite(monto) || monto <= 0) {
      this.formError.set('El monto debe ser mayor que 0.');
      return;
    }
    this.saving.set(true);
    this.formError.set(null);
    this.api
      .create({ referencia_tipo: 'PEDIDO', referencia_id: orderId, metodo: this.method(), monto, estado })
      .subscribe({
        next: (payment) => {
          this.saving.set(false);
          this.dialogVisible.set(false);
          this.notify.success(`Pago #${payment.id} registrado`, STATE_LABEL[estado]);
          if (estado === 'COMPLETADO') {
            this.markOrderPaid(orderId);
          } else {
            this.load();
          }
        },
        error: (error: unknown) => {
          this.saving.set(false);
          this.formError.set(toApiMessage(error));
        },
      });
  }

  /** PATCH estado = COMPLETADO y, si el pedido seguía pendiente, pasa a pagado. */
  confirm(payment: Payment): void {
    this.api.update(payment.id, { estado: 'COMPLETADO' }).subscribe({
      next: () => {
        this.notify.success(`Pago #${payment.id} confirmado`);
        this.markOrderPaid(payment.referencia_id);
      },
      error: (error: unknown) => this.notify.error('No se pudo confirmar', toApiMessage(error)),
    });
  }

  annul(payment: Payment): void {
    this.confirmation.confirm({
      header: 'Anular pago',
      message: `¿Anular el pago #${payment.id} de ${cop.format(toNumber(payment.monto))}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Anular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () =>
        this.api.deactivate(payment.id).subscribe({
          next: () => {
            this.notify.warn('Pago anulado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo anular', toApiMessage(error)),
        }),
    });
  }

  remove(payment: Payment): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el pago #${payment.id}. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(payment.id).subscribe({
          next: () => {
            this.notify.success('Pago eliminado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        }),
    });
  }

  private markOrderPaid(orderId: number): void {
    const order = this.orderById().get(orderId);
    if (order?.estado !== 'pendiente' || !this.session.canPermission('PATCH /api/pedidos/:id/estado')) {
      this.load();
      return;
    }
    this.ordersApi.changeState(orderId, 'pagado').subscribe({
      next: () => {
        this.notify.info(`Pedido #${orderId} marcado como pagado`);
        this.load();
      },
      error: (error: unknown) => {
        this.notify.warn('El pago quedó registrado, pero el pedido no cambió de estado', toApiMessage(error));
        this.load();
      },
    });
  }
}
