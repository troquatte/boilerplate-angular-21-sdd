import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly user = this.authService.currentUser;
  readonly usersList = signal<User[]>([]);
  readonly isLoadingUsers = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.errorMessage.set('');
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.usersList.set(users);
        this.isLoadingUsers.set(false);
      },
      error: () => {
        this.errorMessage.set('Erro ao carregar a lista de usuários.');
        this.isLoadingUsers.set(false);
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
    });
  }
}
