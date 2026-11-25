import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { SessionTokens } from '../models/auth.model';
import { AuthService } from '../services/auth';
import { SessionStore } from '../services/session-store';

/** Un solo refresh en vuelo para todas las peticiones concurrentes (variable de módulo). */
let refreshInFlight: Observable<SessionTokens> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const auth = inject(AuthService);
  const router = inject(Router);

  // OPEN: login, refresh y logout llevan la credencial en el cuerpo.
  const isPublicAuthCall =
    req.url.includes('/sesion/login') ||
    req.url.includes('/sesion/refresh') ||
    req.url.includes('/sesion/logout');

  const accessToken = session.accessToken();
  const request =
    accessToken && !isPublicAuthCall
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isPublicAuthCall ||
        !session.authEnabled
      ) {
        return throwError(() => error);
      }

      if (!session.refreshToken()) {
        redirectToLogin(session, router);
        return throwError(() => error);
      }

      refreshInFlight ??= auth.refresh().pipe(
        catchError((refreshError: unknown) => {
          redirectToLogin(session, router);
          return throwError(() => refreshError);
        }),
        finalize(() => {
          refreshInFlight = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

      return refreshInFlight.pipe(
        switchMap(() => {
          const renewed = session.accessToken();
          return next(
            req.clone({ setHeaders: renewed ? { Authorization: `Bearer ${renewed}` } : {} }),
          );
        }),
      );
    }),
  );
};

function redirectToLogin(session: SessionStore, router: Router): void {
  session.clear();
  const returnUrl = router.url.startsWith('/login') ? '/dashboard' : router.url;
  void router.navigate(['/login'], { queryParams: { returnUrl } });
}
