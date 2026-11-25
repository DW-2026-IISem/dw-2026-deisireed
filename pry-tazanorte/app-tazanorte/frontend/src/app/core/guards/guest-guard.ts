import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/** Con sesión no se vuelve al login: se va al inicio de su rol. */
export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  return session.isAuthenticated() ? inject(Router).createUrlTree(['/']) : true;
};
