import { Routes } from '@angular/router';
import { ClientesListComponent } from './modules/clientes/pages/clientes-list/clientes-list.component';

export const adminClientesRoutes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
  },
];
