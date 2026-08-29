import { Component, inject } from '@angular/core';
import { PaginationService } from '../../../services/pagination.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination">
      <button
        class="theme-btn theme-btn__secondary"
        [disabled]="pagination.page() === 1"
        (click)="pagination.previousPage()"
      >
        Anterior
      </button>
      <span class="pagination__info">
        Página {{ pagination.page() }} de {{ pagination.totalPages() }}
      </span>
      <button
        class="theme-btn theme-btn__secondary"
        [disabled]="pagination.page() === pagination.totalPages()"
        (click)="pagination.nextPage()"
      >
        Próxima
      </button>
    </div>
  `,
  styles: `
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;

      &__info {
        font-size: 0.875rem;
        color: var(--gray-050);
      }
    }
  `,
})
export class PaginationComponent {
  readonly pagination = inject(PaginationService);
}
