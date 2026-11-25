import { Routes } from '@angular/router';
import { permissionGuard } from '../core/guards/permission-guard';

/** Pantallas de caja, barra y bodega (hijas de Shell). */
export const CAFE_ROUTES: Routes = [
  {
    path: 'insumos',
    title: 'Insumos · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/insumos' },
    loadComponent: () => import('./supplies/supply-list/supply-list').then((m) => m.SupplyList),
  },
  {
    path: 'consumos',
    title: 'Consumo de insumos · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/insumo-pedido-detalles' },
    loadComponent: () =>
      import('./supply-order-items/supply-order-item-list/supply-order-item-list').then((m) => m.SupplyOrderItemList),
  },
  {
    path: 'pagos',
    title: 'Pagos · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/pagos' },
    loadComponent: () => import('./payments/payment-list/payment-list').then((m) => m.PaymentList),
  },
  {
    path: 'puntos',
    title: 'Puntos · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/puntos-fidelizacion' },
    loadComponent: () =>
      import('./loyalty-points/loyalty-point-list/loyalty-point-list').then((m) => m.LoyaltyPointList),
  },
];
