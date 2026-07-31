import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './modules/auth/guards/auth.guard';
import { adminGuard } from './modules/auth/guards/admin.guard';
import { clientGuard } from './modules/auth/guards/client.guard';
import { AuthService } from './modules/auth/services/auth.service';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: 'design-system',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./modules/design-system/design-system.routes').then(
        (m) => m.designSystemRoutes,
      ),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import(
        './modules/dashboard-admin/pages/dashboard/dashboard-admin/dashboard-admin.component'
      ).then((m) => m.DashboardAdminComponent),
  },
  {
    path: 'client/home',
    canActivate: [clientGuard],
    loadComponent: () =>
      import('./modules/auth/pages/client-home/client-home.component').then(
        (m) => m.ClientHomeComponent,
      ),
  },
  {
    path: '',
    redirectTo: () => {
      const authService = inject(AuthService);
      const user = authService.currentUser();
      if (user) {
        return user.role === 'ADMIN' ? 'admin/dashboard' : 'client/home';
      }
      return 'auth/login';
    },
    pathMatch: 'full',
  },
];
