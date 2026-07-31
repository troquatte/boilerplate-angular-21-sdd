import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './pages/dashboard/dashboard-admin/dashboard-admin.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardAdminComponent,
    children: [],
  },
];
