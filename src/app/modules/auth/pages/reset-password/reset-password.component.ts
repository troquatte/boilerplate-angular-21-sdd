import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(false);
  readonly apiError = signal('');

  readonly form = this.fb.group({
    token: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get token() {
    return this.form.controls.token;
  }
  get password() {
    return this.form.controls.password;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.apiError.set('');
    this.isLoading.set(true);

    const email = this.route.snapshot.queryParamMap.get('email') || '';

    this.authService.resetPassword(email, this.token.value!, this.password.value!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.apiError.set(err.error?.error?.message ?? 'Erro ao redefinir senha.');
      },
    });
  }
}
