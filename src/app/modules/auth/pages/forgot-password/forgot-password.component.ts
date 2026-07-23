import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly apiError = signal('');
  readonly successMessage = signal('');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() {
    return this.form.controls.email;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.apiError.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    this.authService.forgotPassword(this.email.value!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/auth/reset-password'], {
          queryParams: { email: this.email.value },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.apiError.set(err.error?.error?.message ?? 'Erro ao processar solicitação.');
      },
    });
  }
}
