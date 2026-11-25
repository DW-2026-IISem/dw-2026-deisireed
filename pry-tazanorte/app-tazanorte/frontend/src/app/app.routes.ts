import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () => import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'clientes' },
      {
        path: 'clientes',
        title: 'Clientes · TazaNorte',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'empleados',
        title: 'Empleados · TazaNorte',
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list').then((m) => m.EmployeeList),
      },
      {
        path: 'turnos-caja',
        title: 'Turnos de caja · TazaNorte',
        loadComponent: () =>
          import('./features/cash-registers/cash-register-list/cash-register-list').then(
            (m) => m.CashRegisterList,
          ),
      },
      {
        path: 'productos',
        title: 'Productos · TazaNorte',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'pedidos',
        title: 'Pedidos · TazaNorte',
        loadComponent: () =>
          import('./features/orders/order-list/order-list').then((m) => m.OrderList),
      },
      {
        path: 'pedidos/nuevo',
        title: 'Nuevo pedido · TazaNorte',
        loadComponent: () =>
          import('./features/orders/order-form/order-form').then((m) => m.OrderForm),
      },
      {
        path: 'detalle-pedidos',
        title: 'Detalle de pedidos · TazaNorte',
        loadComponent: () =>
          import('./features/order-items/order-item-list/order-item-list').then(
            (m) => m.OrderItemList,
          ),
      },
      {
        path: 'dashboard',
        title: 'Panel · TazaNorte',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  { path: '**', redirectTo: 'clientes' },
];
