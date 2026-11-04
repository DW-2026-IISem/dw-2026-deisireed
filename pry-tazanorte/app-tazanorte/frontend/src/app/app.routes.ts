import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * `loadComponent` descarga cada pantalla solo cuando se visita su URL.
 * `Shell` es el layout persistente: sus hijas se dibujan en su `<router-outlet />`.
 */
export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
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
          import('./features/employees/employee-list/employee-list').then(
            (m) => m.EmployeeList,
          ),
      },
      {
        path: 'turnos-caja',
        title: 'Turnos de caja · TazaNorte',
        loadComponent: () =>
          import('./features/cash-registers/cash-register-list/cash-register-list').then(
            (m) => m.CashRegisterList,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
