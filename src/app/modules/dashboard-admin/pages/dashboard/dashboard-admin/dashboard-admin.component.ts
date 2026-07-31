import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent implements OnInit {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';

  private readonly platformId = inject(PLATFORM_ID);

  readonly isLoadingUsers = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  logout(): void {}
}
