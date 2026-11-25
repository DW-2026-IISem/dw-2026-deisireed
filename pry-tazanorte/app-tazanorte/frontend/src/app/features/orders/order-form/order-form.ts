import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { forkJoin } from 'rxjs';
import { CashRegisterRef, ClientRef, OrderChannel, ProductRef } from '../../../core/models/order.model';
import { NotificationService } from '../../../core/services/notification';
import { filterRows } from '../../../core/utils/filter-rows';
import { httpMessage, toNumber } from '../../../core/utils/order-utils';
import { productDescription, productImage, useDefaultImage } from '../../../core/utils/product-media';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { OrderApi, OrderCatalogApi } from '../order-api';

type DraftLine = { producto_id: number; cantidad: number; observaciones: string | null };

/**
 * Pedido en memoria: nada toca el servidor hasta «Registrar pedido».
 * Un solo POST transaccional; el backend calcula precios y totales.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-order-form',
  imports: [
    CurrencyPipe, FormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, MessageModule,
    PageHeader, SelectModule, SelectButtonModule,
  ],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderForm {
  private readonly api = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  readonly clients = signal<ClientRef[]>([]);
  readonly products = signal<ProductRef[]>([]);
  readonly cashRegisters = signal<CashRegisterRef[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly clientId = signal<number | null>(null);
  readonly cashRegisterId = signal<number | null>(null);
  readonly channel = signal<OrderChannel>('caja');
  readonly channels = [
    { label: 'En caja', value: 'caja' },
    { label: 'Para llevar', value: 'para_llevar' },
  ];

  readonly lines = signal<DraftLine[]>([]);
  readonly search = signal('');

  readonly visibleProducts = computed(() =>
    filterRows(this.products(), this.search(), (p) => [p.nombre, p.sku, productDescription(p)]),
  );
  readonly productById = computed(() => new Map(this.products().map((p) => [p.id, p])));
  readonly qtyById = computed(() => new Map(this.lines().map((l) => [l.producto_id, l.cantidad])));
  readonly units = computed(() => this.lines().reduce((sum, l) => sum + l.cantidad, 0));
  readonly total = computed(() => this.lines().reduce((sum, l) => sum + this.lineTotal(l), 0));
  /** 1 punto por cada $ 1.000, como el backend (vista previa, se acredita al pagar). */
  readonly points = computed(() => Math.floor(this.total() / 1000));

  readonly canSave = computed(
    () =>
      this.clientId() !== null &&
      this.cashRegisterId() !== null &&
      this.lines().length > 0 &&
      !this.saving() &&
      !this.loading(),
  );

  protected readonly productImage = productImage;
  protected readonly productDescription = productDescription;
  protected readonly onImageError = useDefaultImage;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      clients: this.catalog.clients(),
      products: this.catalog.products(),
      cashRegisters: this.catalog.cashRegisters(),
    }).subscribe({
      next: ({ clients, products, cashRegisters }) => {
        this.clients.set(clients);
        this.products.set(products);
        this.cashRegisters.set(cashRegisters);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(httpMessage(error));
        this.loading.set(false);
      },
    });
  }

  unitPrice(line: DraftLine): number {
    return toNumber(this.productById().get(line.producto_id)?.precio);
  }

  lineTotal(line: DraftLine): number {
    return this.unitPrice(line) * line.cantidad;
  }

  productName(line: DraftLine): string {
    return this.productById().get(line.producto_id)?.nombre ?? `Producto #${line.producto_id}`;
  }

  addProduct(productId: number): void {
    this.error.set(null);
    this.lines.update((lines) =>
      lines.some((l) => l.producto_id === productId)
        ? lines.map((l) => (l.producto_id === productId ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...lines, { producto_id: productId, cantidad: 1, observaciones: null }],
    );
  }

  changeQty(productId: number, delta: number): void {
    this.lines.update((lines) =>
      lines
        .map((l) => (l.producto_id === productId ? { ...l, cantidad: l.cantidad + delta } : l))
        .filter((l) => l.cantidad > 0),
    );
  }

  setNote(productId: number, value: string): void {
    this.lines.update((lines) =>
      lines.map((l) => (l.producto_id === productId ? { ...l, observaciones: value.trim() || null } : l)),
    );
  }

  clear(): void {
    this.lines.set([]);
  }

  save(): void {
    const clientId = this.clientId();
    const cashRegisterId = this.cashRegisterId();
    if (clientId === null) {
      this.error.set('Selecciona un cliente activo.');
      return;
    }
    if (cashRegisterId === null) {
      this.error.set('Selecciona un turno de caja activo.');
      return;
    }
    if (this.lines().length === 0) {
      this.error.set('El pedido requiere al menos un producto.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.api
      .create({ cliente_id: clientId, turno_caja_id: cashRegisterId, canal: this.channel(), items: this.lines() })
      .subscribe({
        next: ({ order }) => {
          this.saving.set(false);
          this.notify.success(`Pedido #${order.id} registrado`, 'Queda en estado pendiente.');
          void this.router.navigate(['/pedidos']);
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = httpMessage(error);
          this.error.set(message);
          this.notify.error('El pedido no se registró', message);
        },
      });
  }
}
