import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/**
 * Se declara en la ruta: data: { permission: 'GET /api/clientes' }.
 * Es UX: Express vuelve a validar con authenticate + authorize.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const session = inject(SessionStore);
  const permission = route.data?.['permission'] as string | undefined;

  if (!session.authEnabled || !permission || session.canPermission(permission)) {
    return true;
  }
  return inject(Router).createUrlTree(['/forbidden'], { queryParams: { permission } });
};
