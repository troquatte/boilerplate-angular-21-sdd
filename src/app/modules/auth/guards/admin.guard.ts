import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[DEBUG] adminGuard avaliando. isSessionLoaded =', authService.isSessionLoaded());

  const checkAdmin = () => {
    const user = authService.currentUser();
    if (user && user.role === 'ADMIN') {
      return true;
    }
    if (user) {
      console.log('[DEBUG] adminGuard negou o acesso. Usuário não é ADMIN. Redirecionando para client home.');
      return router.createUrlTree(['/client/home']);
    }
    console.log('[DEBUG] adminGuard negou o acesso. Usuário não logado. Redirecionando para login.');
    return router.createUrlTree(['/auth/login']);
  };

  if (authService.isSessionLoaded()) {
    return checkAdmin();
  }

  return toObservable(authService.isSessionLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => checkAdmin()),
  );
};
