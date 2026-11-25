import { HasPermission } from '../../../shared/directives/has-permission';
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { SessionStore } from '../../../core/services/session-store';
import { OrderItem } from '../../../core/models/order-item.model';
import { ClientRef, Order, OrderState, ProductRef } from '../../../core/models/order.model';
import { NotificationService } from '../../../core/services/notification';
import { filterRows } from '../../../core/utils/filter-rows';
import { ORDER_STATE_LABEL, httpMessage, orderSeverity } from '../../../core/utils/order-utils';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { OrderApi, OrderCatalogApi } from '../../orders/order-api';
import { OrderItemApi } from '../order-item-api';

/**
 * CRUD de líneas (/api/detalle-pedidos). Cada cambio hace que el backend
 * recalcule subtotal/total del pedido. Solo se tocan líneas de pedidos `pendiente`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-order-item-list',
  imports: [
    HasPermission,
    CurrencyPipe,
    FormsModule,
    ButtonModule,
    DialogModule,
    EmptyState,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './order-item-list.html',
  styleUrl: './order-item-list.css',
})
export class OrderItemList {
  private readonly api = inject(OrderItemApi);
  private readonly ordersApi = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly items = signal<OrderItem[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly clients = signal<ClientRef[]>([]);
  readonly products = signal<ProductRef[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  // Diálogo crear / editar (signals: son 4 campos simples).
  readonly dialogVisible = signal(false);
  readonly editing = signal<OrderItem | null>(null);
  readonly formOrderId = signal<number | null>(null);
  readonly formProductId = signal<number | null>(null);
  readonly formQuantity = signal(1);
  readonly formNote = signal('');
  readonly formError = signal<string | null>(null);

  readonly dialogTitle = computed(() =>
    this.editing() ? `Editar línea #${this.editing()!.id}` : 'Agregar línea',
  );

  readonly productName = computed(() => {
    const map = new Map(this.products().map((p) => [p.id, p.nombre]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  private readonly orderById = computed(() => new Map(this.orders().map((o) => [o.id, o])));

  /** Solo los pedidos `pendiente` aceptan líneas nuevas. */
  readonly pendingOrderOptions = computed(() => {
    const name = new Map(this.clients().map((c) => [c.id, c.nombre]));
    return this.orders()
      .filter((order) => order.estado === 'pendiente')
      .map((order) => ({
        id: order.id,
        label: `#${order.id} · ${name.get(order.cliente_id) ?? 'Cliente #' + order.cliente_id}`,
      }));
  });

  readonly visibleRows = computed(() =>
    filterRows(this.items(), this.filter(), (item) => [
      item.pedido_id,
      this.productName()(item.producto_id),
      item.observaciones,
    ]),
  );

  readonly severity = orderSeverity;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      items: this.api.list(),
      orders: this.ordersApi.list(),
      clients: this.session.canPermission('GET /api/clientes') ? this.catalog.clients() : of([]),
      products: this.catalog.products(),
    }).subscribe({
      next: ({ items, orders, clients, products }) => {
        this.items.set(items);
        this.orders.set(orders);
        this.clients.set(clients);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.items.set([]);
        this.error.set(httpMessage(error));
        this.loading.set(false);
      },
    });
  }

  orderState(item: OrderItem): OrderState | null {
    return this.orderById().get(item.pedido_id)?.estado ?? null;
  }

  stateText(state: OrderState | null): string {
    return state ? ORDER_STATE_LABEL[state] : '—';
  }

  /** El backend solo permite tocar líneas de pedidos `pendiente`. */
  isEditable(item: OrderItem): boolean {
    return this.orderState(item) === 'pendiente';
  }

  openCreate(): void {
    this.editing.set(null);
    this.formOrderId.set(null);
    this.formProductId.set(null);
    this.formQuantity.set(1);
    this.formNote.set('');
    this.formError.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(item: OrderItem): void {
    this.editing.set(item);
    this.formOrderId.set(item.pedido_id);
    this.formProductId.set(item.producto_id);
    this.formQuantity.set(item.cantidad);
    this.formNote.set(item.observaciones ?? '');
    this.formError.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const current = this.editing();
    const quantity = Number(this.formQuantity());
    const note = this.formNote().trim() || null;

    if (!Number.isInteger(quantity) || quantity < 1) {
      this.formError.set('La cantidad debe ser un entero de al menos 1.');
      return;
    }

    let request;
    if (current) {
      // En edición solo cambian cantidad y observaciones.
      request = this.api.update(current.id, { cantidad: quantity, observaciones: note });
    } else {
      const orderId = this.formOrderId();
      const productId = this.formProductId();
      if (orderId === null || productId === null) {
        this.formError.set('Selecciona un pedido pendiente y un producto.');
        return;
      }
      request = this.api.create({
        pedido_id: orderId,
        producto_id: productId,
        cantidad: quantity,
        observaciones: note,
      });
    }

    this.saving.set(true);
    this.formError.set(null);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          current ? 'Línea actualizada' : 'Línea agregada',
          'Total del pedido recalculado.',
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.formError.set(httpMessage(error));
      },
    });
  }

  deactivate(item: OrderItem): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la línea #${item.id}? El total del pedido #${item.pedido_id} se recalcula.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(item.id).subscribe({
          next: () => {
            this.notify.warn('Línea desactivada');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo desactivar', httpMessage(error)),
        });
      },
    });
  }

  remove(item: OrderItem): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la línea #${item.id}. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(item.id).subscribe({
          next: () => {
            this.notify.success('Línea eliminada');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', httpMessage(error)),
        });
      },
    });
  }
}
