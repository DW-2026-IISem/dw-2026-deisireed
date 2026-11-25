import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { OrderItem } from '../../../core/models/order-item.model';
import { ClientRef, Order, ProductRef } from '../../../core/models/order.model';
import { httpMessage } from '../../../core/utils/order-utils';
import { OrderApi, OrderCatalogApi } from '../../orders/order-api';
import { OrderItemApi } from '../order-item-api';

@Component({
  selector: 'app-order-item-list',
  imports: [
    CurrencyPipe,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    TableModule,
  ],
  templateUrl: './order-item-list.html',
  styleUrl: './order-item-list.css',
})
export class OrderItemList {
  private readonly api = inject(OrderItemApi);
  private readonly ordersApi = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);

  readonly items = signal<OrderItem[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly clients = signal<ClientRef[]>([]);
  readonly products = signal<ProductRef[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  // Diálogo crear / editar (sin FormGroup: son 4 campos simples).
  readonly dialogVisible = signal(false);
  readonly editing = signal<OrderItem | null>(null);
  readonly formOrderId = signal<number | null>(null);
  readonly formProductId = signal<number | null>(null);
  readonly formQuantity = signal(1);
  readonly formNote = signal('');

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

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      items: this.api.list(),
      orders: this.ordersApi.list(),
      clients: this.catalog.clients(),
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
        this.error.set(httpMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** El backend solo permite tocar líneas de pedidos `pendiente`. */
  isEditable(item: OrderItem): boolean {
    return this.orderById().get(item.pedido_id)?.estado === 'pendiente';
  }

  orderState(item: OrderItem): string {
    return this.orderById().get(item.pedido_id)?.estado ?? '—';
  }

  openCreate(): void {
    this.editing.set(null);
    this.formOrderId.set(null);
    this.formProductId.set(null);
    this.formQuantity.set(1);
    this.formNote.set('');
    this.error.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(item: OrderItem): void {
    this.editing.set(item);
    this.formOrderId.set(item.pedido_id);
    this.formProductId.set(item.producto_id);
    this.formQuantity.set(item.cantidad);
    this.formNote.set(item.observaciones ?? '');
    this.error.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const current = this.editing();
    const quantity = Number(this.formQuantity());
    const note = this.formNote().trim() || null;

    if (!Number.isInteger(quantity) || quantity < 1) {
      this.error.set('La cantidad debe ser un entero de al menos 1.');
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
        this.error.set('Selecciona un pedido pendiente y un producto.');
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
    this.error.set(null);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(httpMessage(error));
      },
    });
  }

  deactivate(item: OrderItem): void {
    if (!confirm('¿Desactivar esta línea? El total del pedido se recalcula.')) {
      return;
    }
    this.error.set(null);
    this.api.deactivate(item.id).subscribe({
      next: () => this.load(),
      error: (error: unknown) => this.error.set(httpMessage(error)),
    });
  }

  remove(item: OrderItem): void {
    if (!confirm('¿Eliminar definitivamente esta línea?')) {
      return;
    }
    this.error.set(null);
    this.api.remove(item.id).subscribe({
      next: () => this.load(),
      error: (error: unknown) => this.error.set(httpMessage(error)),
    });
  }
}
