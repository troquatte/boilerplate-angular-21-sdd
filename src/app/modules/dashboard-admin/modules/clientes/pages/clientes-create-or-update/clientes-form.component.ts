import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { IClientes } from '../../interfaces/clientes.interface';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.scss',
})
export class ClientesFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clientesService = inject(ClientesService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isLoading = signal(false);
  readonly clienteId = signal<string | null>(null);

  readonly form = this.fb.group({
    phone: ['', [Validators.required]],
    cpf: [''],
    fullName: [''],
    email: [''],
    birthDate: [''],
    tipo: ['Primeira Compra'],
  });

  get phone() { return this.form.controls.phone; }
  get cpf() { return this.form.controls.cpf; }
  get fullName() { return this.form.controls.fullName; }
  get email() { return this.form.controls.email; }
  get birthDate() { return this.form.controls.birthDate; }
  get tipo() { return this.form.controls.tipo; }

  readonly tipos = [
    'Primeira Compra',
    'Nova Compra',
    'Cliente VIP',
    'Influenciador',
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.clienteId.set(id);
      this.loadCliente(id);
    }
  }

  private loadCliente(id: string): void {
    this.isLoading.set(true);
    this.clientesService.getClienteById(id).subscribe({
      next: (response) => {
        const cliente = response.data;
        this.form.patchValue({
          phone: cliente.phone || '',
          cpf: cliente.cpf || '',
          fullName: cliente.fullName || '',
          email: cliente.email || '',
          birthDate: cliente.birthDate || '',
          tipo: cliente.tipo || 'Primeira Compra',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar os dados do cliente.',
          icon: 'error',
          confirmButtonColor: 'var(--primary)',
        }).then(() => {
          this.router.navigate(['/admin/clientes']);
        });
      },
    });
  }

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    const id = this.clienteId();
    const payload = this.form.value as Omit<IClientes, 'id' | 'createdAt' | 'updatedAt'>;

    const request$ = id
      ? this.clientesService.updateCliente(id, payload)
      : this.clientesService.createCliente(payload);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        Swal.fire({
          title: 'Sucesso!',
          text: id ? 'Cliente atualizado com sucesso.' : 'Cliente cadastrado com sucesso.',
          icon: 'success',
          confirmButtonColor: 'var(--primary)',
        }).then(() => {
          this.router.navigate(['/admin/clientes']);
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        const message = err?.error?.message || 'Ocorreu um erro ao salvar o cliente.';
        Swal.fire({
          title: 'Erro',
          text: message,
          icon: 'error',
          confirmButtonColor: 'var(--primary)',
        });
      },
    });
  }

  back(): void {
    this.router.navigate(['/admin/clientes']);
  }
}
