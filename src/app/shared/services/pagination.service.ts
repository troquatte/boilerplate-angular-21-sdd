import { Injectable, signal } from '@angular/core';

@Injectable()
export class PaginationService {
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly search = signal('');
  readonly totalPages = signal(0);

  setPage(page: number): void {
    this.page.set(Math.max(1, page));
  }

  setPageSize(size: number): void {
    this.pageSize.set(Math.max(1, size));
    this.page.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setTotalPages(total: number): void {
    this.totalPages.set(Math.max(0, total));
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
    }
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
    }
  }
}
