import { Routes } from '@angular/router';
import { ClientesListComponent } from './modules/clientes/pages/clientes-list/clientes-list.component';

export const adminClientesRoutes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./modules/clientes/pages/clientes-create-or-update/clientes-form.component').then(
        (m) => m.ClientesFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./modules/clientes/pages/clientes-create-or-update/clientes-form.component').then(
        (m) => m.ClientesFormComponent,
      ),
  },
  {
    path: '',
    component: ClientesListComponent,
  },
];
