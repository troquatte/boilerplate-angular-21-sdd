import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interface/IUser.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly user = this.authService.currentUser;
  readonly usersList = signal<IUser[]>([]);
  readonly isLoadingUsers = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
    });
  }
}
