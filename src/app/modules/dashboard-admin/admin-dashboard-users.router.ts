import { Routes } from '@angular/router';
import { ERouters } from '@enums/routes';

export const adminDashboardUsersRoutes: Routes = [
  {
    path: '',
    title: 'Usuários do sistema',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-user/dashboard-user-list/dashboard-user-list.component'
      ),
  },
  {
    path: `${ERouters.ADMIN_DASHBOARD_USER_CREATE}`,
    title: 'Criar novo usuário',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-user/dashboard-user-create-or-update/dashboard-user-create-or-update.component'
      ),
  },
  {
    path: `:idUser`,
    title: 'Criar novo usuário',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-user/dashboard-user-create-or-update/dashboard-user-create-or-update.component'
      ),
  },
  {
    path: `:idUser/${ERouters.ADMIN_DASHBOARD_USER_ADD_COURSES}`,
    title: 'Adicionar curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-user/dashboard-user-add-courses/dashboard-user-add-courses.component'
      ),
  },
];
