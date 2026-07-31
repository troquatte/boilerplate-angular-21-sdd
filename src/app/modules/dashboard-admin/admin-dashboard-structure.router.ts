import { Routes } from '@angular/router';
import { ERouters } from '@enums/routes';

export const adminDashboardStructureRoutes: Routes = [
  {
    path: '',
    title: 'Todos os cursos',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-list/dashboard-structure-list.component'
      ),
  },
  {
    path: ERouters.ADMIN_DASHBOARD_STRUCTURE_CREATE,
    title: 'Criar estrutura',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-create-or-update/dashboard-structure-create-or-update.component'
      ),
  },
  {
    path: `${ERouters.ADMIN_DASHBOARD_STRUCTURE_UPDATE}/:idStructure`,
    title: 'Editar estrutura',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-create-or-update/dashboard-structure-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/${ERouters.ADMIN_DASHBOARD_COURSES}`,
    title: 'Cursos da estrutura',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses/dashboard-structure-courses.component'
      ),
  },
  {
    path: `:idStructure/${ERouters.ADMIN_DASHBOARD_STRUCTURE_COURSES_CREATE}`,
    title: 'Criar curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-create-or-update/dashboard-structure-courses-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_STRUCTURE_UPDATE}`,
    title: 'Editar curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-create-or-update/dashboard-structure-courses-create-or-update.component'
      ),
  },

  // Datas Importantes
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_IMPORTANT_DATES}`,
    title: 'Datas importantes',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-important-dates/dashboard-structure-important-dates.component'
      ),
  },

  // How to Study
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY}`,
    title: 'Como estudar',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-whow-to-study/dashboard-structure-courses-whow-to-study.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY}/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY_CREATE}`,
    title: 'Criar como estudar',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-whow-to-study-create-or-update/dashboard-structure-courses-whow-to-study-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY}/:idHowToStudy`,
    title: 'Criar como estudar',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-whow-to-study-create-or-update/dashboard-structure-courses-whow-to-study-create-or-update.component'
      ),
  },

  // How To Study
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY}/:idHowToStudy/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY_CREATE}`,
    title: 'Como estudar - Novo Item',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-whow-to-study-new-item-create-or-update/courses-whow-to-study-item-c-or-u.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_HOW_TO_STUDY}/:idHowToStudy/:idHowToStudyTutorial`,
    title: 'Como estudar - Editar Item',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-courses-whow-to-study-new-item-create-or-update/courses-whow-to-study-item-c-or-u.component'
      ),
  },

  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_DISCIPLINE}`,
    title: 'Disciplinas do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-disciplines-create-or-update/dashboard-structure-disciplines-create-or-update.component'
      ),
  },

  // Questões
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_QUESTIONS}`,
    title: 'Questões do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-questions/dashboard-structure-questions.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_QUESTIONS}/${ERouters.ADMIN_DASHBOARD_QUESTIONS_CREATE}`,
    title: 'Questões do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-questions-create-or-update/dashboard-structure-questions-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_QUESTIONS}/:idQuestion`,
    title: 'Questões do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-questions-create-or-update/dashboard-structure-questions-create-or-update.component'
      ),
  },

  // Simulation
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_SIMULATIONS}`,
    title: 'Simulados do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-simulation/dashboard-structure-simulation.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_SIMULATIONS}/${ERouters.ADMIN_DASHBOARD_SIMULATIONS_CREATE}`,
    title: 'Simulados do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-simulation-create-or-update/dashboard-structure-simulation-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_SIMULATIONS}/:idSimulation`,
    title: 'Simulados do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-simulation-create-or-update/dashboard-structure-simulation-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_SIMULATIONS}/:idSimulation/${ERouters.ADMIN_DASHBOARD_QUESTIONS}/${ERouters.ADMIN_DASHBOARD_QUESTIONS_CREATE}`,
    title: 'Questões do simulado',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-simulation-questions-create-or-update/dashboard-structure-simulation-questions-c-or-u.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_SIMULATIONS}/:idSimulation/${ERouters.ADMIN_DASHBOARD_QUESTIONS}/:idQuestion`,
    title: 'Questões do simulado',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-simulation-questions-create-or-update/dashboard-structure-simulation-questions-c-or-u.component'
      ),
  },

  // TImeline
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_TIMELINE}`,
    title: 'Cronograma do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-timeline/dashboard-structure-timeline.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_TIMELINE}/${ERouters.ADMIN_DASHBOARD_TIMELINE_CREATE}`,
    title: 'Criar cronograma do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-timeline-create-or-update/dashboard-structure-timeline-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_TIMELINE}/:idTimeline`,
    title: 'Editar cronograma do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-timeline-create-or-update/dashboard-structure-timeline-create-or-update.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_TIMELINE}/:idTimeline/${ERouters.ADMIN_DASHBOARD_TIMELINE_DAY}/${ERouters.ADMIN_DASHBOARD_TIMELINE_DAY_CREATE}`,
    title: 'Editar cronograma do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-timeline-days-create-or-update/dashboard-structure-timeline-days-c-or-u.component'
      ),
  },
  {
    path: `:idStructure/:idCourse/${ERouters.ADMIN_DASHBOARD_TIMELINE}/:idTimeline/${ERouters.ADMIN_DASHBOARD_TIMELINE_DAY}/:idDay`,
    title: 'Editar cronograma do curso',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-timeline-days-create-or-update/dashboard-structure-timeline-days-c-or-u.component'
      ),
  },

  // Aulas ao Vivo
  {
    path: `:idStructure/:idCourse/${ERouters.STUDENTS_COURSES_LIVE_CLASS}`,
    title: 'Aulas ao Vivo',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-live-class/dashboard-structure-live-class.component'
      ),
  },

  // Edição Menu
  {
    path: `:idStructure/:idCourse/${ERouters.STUDENTS_COURSES_EDIT_MENU}`,
    title: 'Edição de Menus',
    loadComponent: () =>
      import(
        './pages/dashboard/dashboard-structure/dashboard-structure-menu/dashboard-structure-menu.component'
      ),
  },
];
