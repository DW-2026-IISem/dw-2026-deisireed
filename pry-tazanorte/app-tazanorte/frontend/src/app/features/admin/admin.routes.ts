import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission-guard';

/** Rutas de Seguridad: hijas de Shell, cada una con su GET como permiso. */
export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/usuarios',
    title: 'Usuarios · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/usuarios' },
    loadComponent: () => import('./users/user-list/user-list').then((m) => m.UserList),
  },
  {
    path: 'admin/roles',
    title: 'Roles · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/roles' },
    loadComponent: () => import('./roles/role-list/role-list').then((m) => m.RoleList),
  },
  {
    path: 'admin/recursos',
    title: 'Recursos · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/recursos' },
    loadComponent: () => import('./resources/resource-list/resource-list').then((m) => m.ResourceList),
  },
  {
    path: 'admin/asignaciones',
    title: 'Asignaciones · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/asignaciones-rol' },
    loadComponent: () => import('./role-users/role-user-list/role-user-list').then((m) => m.RoleUserList),
  },
  {
    path: 'admin/permisos',
    title: 'Permisos por rol · TazaNorte',
    canActivate: [permissionGuard],
    data: { permission: 'GET /api/concesiones-rol' },
    loadComponent: () =>
      import('./resource-roles/resource-role-list/resource-role-list').then((m) => m.ResourceRoleList),
  },
];
