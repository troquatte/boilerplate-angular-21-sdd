import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './clientes-create.component.html',
  styleUrl: './clientes-create.component.scss',
})
export class ClientesCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  readonly form = this.fb.group({
    phone: ['', [Validators.required]],
    cpf: [''],
    fullName: [''],
    email: [''],
    birthDate: [''],
    tipo: ['Primeira Compra'],
  });

  get phone() {
    return this.form.controls.phone;
  }
  get cpf() {
    return this.form.controls.cpf;
  }
  get fullName() {
    return this.form.controls.fullName;
  }
  get email() {
    return this.form.controls.email;
  }
  get birthDate() {
    return this.form.controls.birthDate;
  }
  get tipo() {
    return this.form.controls.tipo;
  }

  readonly tipos = [
    'Primeira Compra',
    'Nova Compra',
    'Cliente VIP',
    'Influenciador',
  ];

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    console.log('Dados do cliente:', this.form.value);

    Swal.fire({
      title: 'Sucesso!',
      text: 'Cliente cadastrado com sucesso (mock).',
      icon: 'success',
      confirmButtonColor: 'var(--primary)',
    }).then(() => {
      this.isLoading.set(false);
      this.router.navigate(['/admin/clientes']);
    });
  }

  back(): void {
    this.router.navigate(['/admin/clientes']);
  }
}
