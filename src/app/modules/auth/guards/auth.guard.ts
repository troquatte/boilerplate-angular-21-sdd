import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[DEBUG] authGuard avaliando. isSessionLoaded =', authService.isSessionLoaded(), 'isAuthenticated =', authService.isAuthenticated());

  const checkAuth = () => {
    if (authService.isAuthenticated()) {
      return true;
    }
    console.log('[DEBUG] authGuard negou o acesso. Redirecionando para login.');
    return router.createUrlTree(['/auth/login']);
  };

  if (authService.isSessionLoaded()) {
    return checkAuth();
  }

  return toObservable(authService.isSessionLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => checkAuth()),
  );
};
