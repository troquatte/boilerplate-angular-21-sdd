import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin-dashboard.router').then((m) => m.adminDashboardRoutes),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./admin-clientes.router').then((m) => m.adminClientesRoutes),
  },
];
