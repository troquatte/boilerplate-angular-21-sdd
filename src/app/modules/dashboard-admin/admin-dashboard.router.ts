import { Routes } from '@angular/router';

// Enum
import { ERouters } from '@enums/routes';
import DashboardContactComponent from './pages/dashboard/dashboard-contact/dashboard-contact.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ERouters.ADMIN_DASHBOARD_STRUCTURE,
  },
  {
    path: ERouters.ADMIN_DASHBOARD_STRUCTURE,
    loadChildren: () =>
      import('./admin-dashboard-structure.router').then(
        (r) => r.adminDashboardStructureRoutes,
      ),
  },
  {
    path: ERouters.ADMIN_DASHBOARD_DISCIPLINE,
    loadChildren: () =>
      import('./admin-dashboard-discipline.router').then(
        (r) => r.adminDashboardDisciplineRoutes,
      ),
  },
  {
    path: ERouters.ADMIN_DASHBOARD_USER,
    loadChildren: () =>
      import('./admin-dashboard-users.router').then(
        (r) => r.adminDashboardUsersRoutes,
      ),
  },
  {
    path: ERouters.ADMIN_DASHBOARD_COURSE_QUESTIONS,
    loadChildren: () =>
      import('./admin-dashboard-questions.router').then(
        (r) => r.adminDashboardQuestionsRoutes,
      ),
  },
  {
    path: ERouters.STUDENTS_PROFILE_CONTACT,
    component: DashboardContactComponent,
  },
];
