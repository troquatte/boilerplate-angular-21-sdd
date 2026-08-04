import { Routes } from '@angular/router';
import { ClientesListComponent } from './modules/clientes/pages/clientes-list/clientes-list.component';

export const adminClientesRoutes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./modules/clientes/pages/clientes-create/clientes-create.component').then(
        (m) => m.ClientesCreateComponent,
      ),
  },
];
