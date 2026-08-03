import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  totalItems = input<number>(0);

  pageSizeChange = output<number>();
  currentPageChange = output<number>();

  readonly pageSizes = [5, 10, 20];

  readonly startItem = computed(() => {
    const total = this.totalItems();
    if (total === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  readonly endItem = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return end > this.totalItems() ? this.totalItems() : end;
  });

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    return size === 0 ? 0 : Math.ceil(this.totalItems() / size);
  });

  readonly hasPrevious = computed(() => this.currentPage() > 1);
  readonly hasNext = computed(() => this.currentPage() < this.totalPages());

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(select.value));
  }

  previousPage(): void {
    if (this.hasPrevious()) {
      this.currentPageChange.emit(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.currentPageChange.emit(this.currentPage() + 1);
    }
  }
}
