import { Routes } from '@angular/router';
import { ERouters } from '@enums/routes';

export const adminDashboardDisciplineRoutes: Routes = [
  {
    path: '',
    title: 'Todas as disciplinas',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-list/dashboard-discipline-list.component'
      ),
  },
  {
    path: ERouters.ADMIN_DASHBOARD_DISCIPLINE_CREATE,
    title: 'Criar disciplina',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-create-or-update/dashboard-discipline-create-or-update.component'
      ),
  },
  {
    path: ':idDisciplines',
    title: 'Editar disciplina',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-create-or-update/dashboard-discipline-create-or-update.component'
      ),
  },
  {
    path: `:idDisciplines/${ERouters.ADMIN_DASHBOARD_DISCIPLINE_CHAPTER}`,
    title: 'Todas os capítulos',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-chapter-list/dashboard-discipline-chapter-list.component'
      ),
  },
  {
    path: `:idDisciplines/${ERouters.ADMIN_DASHBOARD_DISCIPLINE_CHAPTER_CREATE}`,
    title: 'Criar novo capítulo',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-chapter-create-or-update/dashboard-discipline-chapter-create-or-update.component'
      ),
  },
  {
    path: `:idDisciplines/:idDisciplinesChapter`,
    title: 'Criar novo capítulo',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-chapter-create-or-update/dashboard-discipline-chapter-create-or-update.component'
      ),
  },
  {
    path: `:idDisciplines/:idDisciplinesChapter/${ERouters.ADMIN_DASHBOARD_DISCIPLINE_CHAPTER_CLASSES}`,
    title: 'Aulas do capítulo',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-chapter-classes-list/dashboard-discipline-chapter-classes-list.component'
      ),
  },
  {
    path: `:idDisciplines/:idDisciplinesChapter/${ERouters.ADMIN_DASHBOARD_DISCIPLINE_CHAPTER_CREATE_CLASSES}`,
    title: 'Adicionar aula ao capítulo',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-chapter-classes-c-or-u/dashboard-discipline-chapter-classes-c-or-u.component'
      ),
  },
  {
    path: `:idDisciplines/:idDisciplinesChapter/:idDisciplinesChapterClasses`,
    title: 'Adicionar aula ao capítulo',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-discipline/pages/dashboard-discipline-chapter-classes-c-or-u/dashboard-discipline-chapter-classes-c-or-u.component'
      ),
  },
];
