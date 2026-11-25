import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';
import { toApiMessage } from '../utils/api-error';

/**
 * Avisos globales solo para fallos que ninguna pantalla puede resolver:
 * backend caído (0) y errores del servidor (5xx). 400/403/404/409 los muestra cada pantalla.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          notify.error('Sin conexión', 'No se pudo contactar al backend en http://localhost:4000.');
        } else if (error.status >= 500) {
          notify.error('Error del servidor', toApiMessage(error));
        }
      }
      return throwError(() => error);
    }),
  );
};
