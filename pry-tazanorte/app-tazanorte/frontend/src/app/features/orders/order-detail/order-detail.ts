import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Order, ProductRef } from '../../../core/models/order.model';
import { ORDER_STATE_LABEL, orderSeverity } from '../../../core/utils/order-utils';

/** Presentacional: recibe el pedido ya cargado (con `items`) y el catálogo de productos. */
@Component({
  selector: 'app-order-detail',
  imports: [CurrencyPipe, DatePipe, TableModule, TagModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  readonly order = input.required<Order>();
  readonly products = input<ProductRef[]>([]);
  readonly clientName = input<string>('');

  readonly stateLabel = ORDER_STATE_LABEL;
  readonly severity = orderSeverity;

  readonly productName = computed(() => {
    const map = new Map(this.products().map((product) => [product.id, product.nombre]));
    return (id: number) => map.get(id) ?? `Producto #${id}`;
  });

  readonly activeItems = computed(() => (this.order().items ?? []).filter((item) => item.is_active));

  readonly itemCount = computed(() =>
    this.activeItems().reduce((sum, item) => sum + item.cantidad, 0),
  );
}
