import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const injector = inject(Injector);

  const apiReq = req.clone({ withCredentials: true });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Evita loop infinito em chamadas de refresh/logout
      const isAuthEndpoint =
        req.url.includes('/api/auth/refresh') || req.url.includes('/api/auth/logout');

      if (error.status === 401 && !isAuthEndpoint) {
        const authService = injector.get(AuthService);

        return authService.refresh().pipe(
          switchMap(() => next(apiReq)),
          catchError(() => {
            authService.logout().subscribe();
            
            // Resolve o Router e redireciona de forma assíncrona para evitar erro de DI circular
            setTimeout(() => {
              const router = injector.get(Router);
              router.navigate(['/auth/login']);
            });

            return throwError(() => error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
