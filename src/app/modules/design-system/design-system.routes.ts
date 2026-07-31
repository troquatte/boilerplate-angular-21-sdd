import { Routes } from '@angular/router';

export const designSystemRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/design-system-page/design-system-page.component'
      ).then((m) => m.DesignSystemPageComponent),
  },
];
