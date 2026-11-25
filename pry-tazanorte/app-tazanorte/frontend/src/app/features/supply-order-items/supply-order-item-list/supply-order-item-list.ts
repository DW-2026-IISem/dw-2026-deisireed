import { DecimalPipe } from '@angular/common';
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
import { toNumber } from '../../../core/models/api.model';
import { OrderItem } from '../../../core/models/order-item.model';
import { Order, ProductRef } from '../../../core/models/order.model';
import { SupplyOrderItem } from '../../../core/models/supply-order-item.model';
import { Supply } from '../../../core/models/supply.model';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { OrderItemApi } from '../../order-items/order-item-api';
import { OrderApi, OrderCatalogApi } from '../../orders/order-api';
import { SupplyApi } from '../../supplies/supply-api';
import { SupplyOrderItemApi } from '../supply-order-item-api';

/** Solo se registran insumos en líneas de pedidos que barra está atendiendo. */
const PREP_STATES = ['pagado', 'en_preparacion'];

/**
 * Consumo de insumos por línea de pedido (/api/insumo-pedido-detalles).
 * BARISTA registra; BODEGA consulta y anula; SUPERVISOR consulta.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-supply-order-item-list',
  imports: [
    DecimalPipe, FormsModule, ButtonModule, DialogModule, EmptyState, HasPermission, InputNumberModule,
    InputTextModule, MessageModule, PageHeader, SelectModule, StatusTag, TableModule, TagModule, TooltipModule,
  ],
  templateUrl: './supply-order-item-list.html',
  styleUrl: './supply-order-item-list.css',
})
export class SupplyOrderItemList {
  private readonly api = inject(SupplyOrderItemApi);
  private readonly suppliesApi = inject(SupplyApi);
  private readonly orderItemsApi = inject(OrderItemApi);
  private readonly ordersApi = inject(OrderApi);
  private readonly catalog = inject(OrderCatalogApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<SupplyOrderItem[]>([]);
  readonly supplies = signal<Supply[]>([]);
  readonly orderItems = signal<OrderItem[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly products = signal<ProductRef[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly supplyById = computed(() => new Map(this.supplies().map((s) => [s.id, s])));
  readonly orderItemById = computed(() => new Map(this.orderItems().map((l) => [l.id, l])));
  readonly orderById = computed(() => new Map(this.orders().map((o) => [o.id, o])));
  readonly productName = computed(() => {
    const map = new Map(this.products().map((p) => [p.id, p.nombre]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (r) => [
      this.supplyName(r),
      this.supplyById().get(r.insumo_id)?.codigo,
      this.lineLabel(r.pedido_detalle_id),
    ]),
  );

  readonly activeSupplies = computed(() => this.supplies().filter((s) => s.is_active));

  /** Líneas activas de pedidos pagados o en preparación. */
  readonly lineOptions = computed(() =>
    this.orderItems()
      .filter((l) => l.is_active && PREP_STATES.includes(this.orderById().get(l.pedido_id)?.estado ?? ''))
      .map((l) => ({ id: l.id, label: this.lineLabel(l.id) })),
  );

  // Diálogo registrar / editar
  readonly dialogVisible = signal(false);
  readonly editing = signal<SupplyOrderItem | null>(null);
  readonly lineId = signal<number | null>(null);
  readonly supplyId = signal<number | null>(null);
  readonly quantity = signal<number>(1);
  readonly formError = signal<string | null>(null);
  readonly dialogTitle = computed(() => (this.editing() ? 'Editar cantidad usada' : 'Registrar insumo'));
  readonly selectedUnit = computed(() => this.supplyById().get(this.supplyId() ?? 0)?.unidad_medida ?? '');

  protected readonly toNumber = toNumber;

  constructor() {
    this.load();
  }

  load(): void {
    const can = (p: string) => this.session.canPermission(p);
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      rows: this.api.list(),
      supplies: this.suppliesApi.list(),
      // BODEGA no lee pedidos ni sus líneas: verá «Línea #id».
      orderItems: can('GET /api/detalle-pedidos') ? this.orderItemsApi.list() : of([] as OrderItem[]),
      orders: can('GET /api/pedidos') ? this.ordersApi.list() : of([] as Order[]),
      products: can('GET /api/productos') ? this.catalog.products() : of([] as ProductRef[]),
    }).subscribe({
      next: ({ rows, supplies, orderItems, orders, products }) => {
        this.rows.set(rows);
        this.supplies.set(supplies);
        this.orderItems.set(orderItems);
        this.orders.set(orders);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  lineLabel(lineId: number): string {
    const line = this.orderItemById().get(lineId);
    return line ? `Pedido #${line.pedido_id} · ${this.productName()(line.producto_id)}` : `Línea #${lineId}`;
  }

  supplyName(row: SupplyOrderItem): string {
    return this.supplyById().get(row.insumo_id)?.nombre ?? `Insumo #${row.insumo_id}`;
  }

  unit(row: SupplyOrderItem): string {
    return this.supplyById().get(row.insumo_id)?.unidad_medida ?? '';
  }

  openCreate(): void {
    this.editing.set(null);
    this.lineId.set(null);
    this.supplyId.set(null);
    this.quantity.set(1);
    this.formError.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(row: SupplyOrderItem): void {
    this.editing.set(row);
    this.lineId.set(row.pedido_detalle_id);
    this.supplyId.set(row.insumo_id);
    this.quantity.set(toNumber(row.cantidad_usada));
    this.formError.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const current = this.editing();
    const cantidad = Number(this.quantity());
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      this.formError.set('La cantidad usada debe ser mayor que 0.');
      return;
    }

    let request;
    if (current) {
      request = this.api.update(current.id, { cantidad_usada: cantidad });
    } else {
      const lineId = this.lineId();
      const supplyId = this.supplyId();
      if (lineId === null || supplyId === null) {
        this.formError.set('Selecciona la línea del pedido y el insumo.');
        return;
      }
      request = this.api.create({ pedido_detalle_id: lineId, insumo_id: supplyId, cantidad_usada: cantidad });
    }

    this.saving.set(true);
    this.formError.set(null);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Consumo actualizado' : 'Insumo registrado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.formError.set(toApiMessage(error));
      },
    });
  }

  annul(row: SupplyOrderItem): void {
    this.confirmation.confirm({
      header: 'Anular consumo',
      message: `¿Anular ${this.supplyName(row)} de ${this.lineLabel(row.pedido_detalle_id)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Anular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () =>
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Consumo anulado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo anular', toApiMessage(error)),
        }),
    });
  }

  remove(row: SupplyOrderItem): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará este consumo. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Consumo eliminado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        }),
    });
  }
}
