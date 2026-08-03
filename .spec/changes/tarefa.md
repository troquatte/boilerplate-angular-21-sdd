Dentro de adminDashboardRoutes src\app\modules\dashboard-admin\admin-dashboard.router.ts

import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './pages/dashboard/dashboard-admin/dashboard-admin.component';

export const adminDashboardRoutes: Routes = [
{
path: '',
component: DashboardAdminComponent,
},
];

Precisamos criar modulos filhos para dentro dele adminDashboardRoutes hoje já temos a path: '',
Precisamos criar outra path: 'clientes' e criar pasta modulos dentro de dashboard-admin pois vai criar o modulo clientes dentro teremos, componentes, pages, services .router etc. ( seguindo padrão de projeto que temos hoje )
