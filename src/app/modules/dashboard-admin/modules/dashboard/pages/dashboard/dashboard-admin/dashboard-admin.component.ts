import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { environment } from '../../../../../../../../environments/environment.development';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatProgressSpinnerModule, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent implements OnInit {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoadingUsers = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    isPlatformBrowser(this.platformId);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
    });
  }
}
