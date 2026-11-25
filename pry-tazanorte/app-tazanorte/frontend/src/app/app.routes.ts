import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';
import { SessionStore } from './core/services/session-store';
import { homeRoute } from './layout/shell/nav.config';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión · TazaNorte',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'construir',
    loadComponent: () => import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        // Inicio por rol: primera pantalla del menú que puede abrir.
        path: '',
        pathMatch: 'full',
        redirectTo: () => {
          const session = inject(SessionStore);
          return homeRoute((p) => session.canPermission(p));
        },
      },
      {
        path: 'dashboard',
        title: 'Panel · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/pedidos' },
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'perfil',
        title: 'Mi perfil · TazaNorte',
        loadComponent: () => import('./features/auth/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'forbidden',
        title: 'Acceso denegado · TazaNorte',
        loadComponent: () => import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
      },
      {
        path: 'clientes',
        title: 'Clientes · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/clientes' },
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'empleados',
        title: 'Empleados · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/empleados' },
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list').then((m) => m.EmployeeList),
      },
      {
        path: 'turnos-caja',
        title: 'Turnos de caja · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/turnos-caja' },
        loadComponent: () =>
          import('./features/cash-registers/cash-register-list/cash-register-list').then(
            (m) => m.CashRegisterList,
          ),
      },
      {
        path: 'productos',
        title: 'Productos · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/productos' },
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'pedidos',
        title: 'Pedidos · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/pedidos' },
        loadComponent: () =>
          import('./features/orders/order-list/order-list').then((m) => m.OrderList),
      },
      {
        path: 'pedidos/nuevo',
        title: 'Nuevo pedido · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'POST /api/pedidos' },
        loadComponent: () =>
          import('./features/orders/order-form/order-form').then((m) => m.OrderForm),
      },
      {
        path: 'detalle-pedidos',
        title: 'Detalle de pedidos · TazaNorte',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/detalle-pedidos' },
        loadComponent: () =>
          import('./features/order-items/order-item-list/order-item-list').then(
            (m) => m.OrderItemList,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
