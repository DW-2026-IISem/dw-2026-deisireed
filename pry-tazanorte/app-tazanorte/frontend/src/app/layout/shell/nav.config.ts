export interface NavItem {
  label: string;
  icon: string;
  routerLink: string;
  /** "MÉTODO /api/ruta". Sin permiso = visible para cualquier sesión. */
  permission?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Única fuente de verdad del menú. Shell lo filtra con SessionStore.canPermission(). */
export const NAV: NavGroup[] = [
  {
    label: 'Operación',
    items: [
      {
        label: 'Panel',
        icon: 'pi pi-chart-bar',
        routerLink: '/dashboard',
        permission: 'GET /api/pedidos',
      },
      {
        label: 'Nuevo pedido',
        icon: 'pi pi-plus-circle',
        routerLink: '/pedidos/nuevo',
        permission: 'POST /api/pedidos',
      },
      {
        label: 'Pedidos',
        icon: 'pi pi-shopping-cart',
        routerLink: '/pedidos',
        permission: 'GET /api/pedidos',
      },
      {
        label: 'Detalle de pedidos',
        icon: 'pi pi-list',
        routerLink: '/detalle-pedidos',
        permission: 'GET /api/detalle-pedidos',
      },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      {
        label: 'Productos',
        icon: 'pi pi-box',
        routerLink: '/productos',
        permission: 'GET /api/productos',
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        routerLink: '/clientes',
        permission: 'GET /api/clientes',
      },
    ],
  },
  {
    label: 'Personal',
    items: [
      {
        label: 'Empleados',
        icon: 'pi pi-id-card',
        routerLink: '/empleados',
        permission: 'GET /api/empleados',
      },
      {
        label: 'Turnos de caja',
        icon: 'pi pi-clock',
        routerLink: '/turnos-caja',
        permission: 'GET /api/turnos-caja',
      },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        routerLink: '/admin/usuarios',
        permission: 'GET /api/usuarios',
      },
      {
        label: 'Roles',
        icon: 'pi pi-shield',
        routerLink: '/admin/roles',
        permission: 'GET /api/roles',
      },
      {
        label: 'Recursos',
        icon: 'pi pi-sitemap',
        routerLink: '/admin/recursos',
        permission: 'GET /api/recursos',
      },
      {
        label: 'Asignaciones',
        icon: 'pi pi-link',
        routerLink: '/admin/asignaciones',
        permission: 'GET /api/asignaciones-rol',
      },
      {
        label: 'Permisos por rol',
        icon: 'pi pi-key',
        routerLink: '/admin/permisos',
        permission: 'GET /api/concesiones-rol',
      },
    ],
  },
  {
    label: 'Cuenta',
    items: [{ label: 'Mi perfil', icon: 'pi pi-user-edit', routerLink: '/perfil' }],
  },
];

/** Primera pantalla del menú que el rol puede abrir (inicio por rol). */
export function homeRoute(can: (permission: string) => boolean): string {
  for (const group of NAV) {
    for (const item of group.items) {
      if (!item.permission || can(item.permission)) {
        return item.routerLink;
      }
    }
  }
  return '/perfil';
}
