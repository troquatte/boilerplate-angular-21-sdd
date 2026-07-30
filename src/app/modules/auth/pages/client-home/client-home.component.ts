import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [],
  templateUrl: './client-home.component.html',
})
export class ClientHomeComponent {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
    });
  }
}
