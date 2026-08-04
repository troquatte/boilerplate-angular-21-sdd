import { Component, PLATFORM_ID, OnInit, effect, inject, signal, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import Swal from 'sweetalert2';
import { IClientes } from '../../interfaces/clientes.interface';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { PaginationService } from '../../../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [PaginationComponent, RouterLink],
  providers: [PaginationService],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly pagination = inject(PaginationService);

  readonly clientes = signal<IClientes[]>([]);
  readonly isLoading = signal(false);
  readonly searchInput = signal('');

  constructor() {
    // Inicializa state a partir da URL (única leitura)
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const page = params['page'] ? Number(params['page']) : 1;
      const pageSize = params['pageSize'] ? Number(params['pageSize']) : 10;
      const search = params['search'] || '';

      this.pagination.setPage(page);
      this.pagination.setPageSize(pageSize);
      this.pagination.setSearch(search);
      this.searchInput.set(search);
    });

    // Debounce do input de busca -> PaginationService.search
    toObservable(this.searchInput)
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.pagination.setSearch(value);
      });

    // Carrega dados quando page/search mudam (e sessão está pronta)
    effect(() => {
      const isBrowser = isPlatformBrowser(this.platformId);
      const isLoaded = this.authService.isSessionLoaded();
      const isAuth = this.authService.isAuthenticated();
      const page = this.pagination.page();
      const search = this.pagination.search();

      if (isBrowser && isLoaded && isAuth) {
        this.loadClientes();
      }
    });

    // Sincroniza URL quando page/search mudam (não reage a URL)
    effect(() => {
      const page = this.pagination.page();
      const pageSize = this.pagination.pageSize();
      const search = this.pagination.search();

      // untracked: não reage a mudanças de URL (evita loop)
      const currentParams = untracked(() => this.route.snapshot.queryParams);
      const currentPage = currentParams['page'] || '1';
      const currentPageSize = currentParams['pageSize'] || '10';
      const currentSearch = currentParams['search'] || '';

      if (
        String(page) !== String(currentPage) ||
        String(pageSize) !== String(currentPageSize) ||
        search !== currentSearch
      ) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            page: String(page),
            pageSize: String(pageSize),
            search: search || undefined,
          },
          replaceUrl: true,
        });
      }
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.route.snapshot.queryParams;
    const hasParams = params['page'] !== undefined || params['pageSize'] !== undefined || params['search'] !== undefined;

    if (!hasParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: String(this.pagination.page()),
          pageSize: String(this.pagination.pageSize()),
          search: this.pagination.search() || undefined,
        },
        replaceUrl: true,
      });
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
      .subscribe({
        next: (response) => {
          this.clientes.set(response.data);
          this.pagination.setTotalPages(response.meta.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
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
