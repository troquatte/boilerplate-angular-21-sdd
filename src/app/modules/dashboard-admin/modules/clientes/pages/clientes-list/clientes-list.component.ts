import { Component, OnInit, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { IClientes } from '../../interfaces/clientes.interface';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly clientes = signal<IClientes[]>([]);
  readonly isLoading = signal(true);

  constructor() {
    effect(() => {
      if (
        isPlatformBrowser(this.platformId) &&
        this.authService.isSessionLoaded() &&
        this.authService.isAuthenticated()
      ) {
        this.loadClientes();
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadClientes();
    }
  }

  private loadClientes(): void {
    this.isLoading.set(true);
    this.clientesService.getClientes().subscribe((response) => {
      this.clientes.set(response.data);
      this.isLoading.set(false);
    });
  }

  onDelete(cliente: IClientes): void {
    Swal.fire({
      title: 'Confirmar exclusão',
      text: `Deseja deletar o cliente "${cliente.fullName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: 'var(--gray-030)',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deletar cliente:', cliente.id);
      }
    });
  }

  onEdit(cliente: IClientes): void {
    console.log('Editar cliente:', cliente.id);
  }
}
