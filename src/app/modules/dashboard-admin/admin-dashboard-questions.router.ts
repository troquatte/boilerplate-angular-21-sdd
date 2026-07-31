import { Routes } from '@angular/router';

export const adminDashboardQuestionsRoutes: Routes = [
  {
    path: '',
    title: 'Questões dos usuários',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-questions/dashboard-questions.component'
      ),
  },
];
