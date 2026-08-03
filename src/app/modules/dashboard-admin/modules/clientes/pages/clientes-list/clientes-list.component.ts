import { Component, OnInit, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { IClientes } from '../../interfaces/clientes.interface';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { PaginationService } from '../../../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [PaginationComponent],
  providers: [PaginationService],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly pagination = inject(PaginationService);

  readonly clientes = signal<IClientes[]>([]);
  readonly isLoading = signal(true);
  readonly searchInput = signal('');

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

    toObservable(this.searchInput)
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.pagination.setSearch(value);
      });

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.pagination.page();
        this.pagination.search();
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
    this.clientesService
      .getClientes({
        page: this.pagination.page(),
        pageSize: this.pagination.pageSize(),
        search: this.pagination.search() || undefined,
      })
      .subscribe((response) => {
        this.clientes.set(response.data);
        this.pagination.setTotalPages(response.meta.totalPages);
        this.isLoading.set(false);
      });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.set(value);
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
