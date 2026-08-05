import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { EnderecoService } from '../../services/endereco.service';
import { IClientes } from '../../interfaces/clientes.interface';
import { IEndereco } from '../../interfaces/endereco.interface';

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
  private readonly enderecoService = inject(EnderecoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isLoading = signal(false);
  readonly clienteId = signal<string | null>(null);
  readonly enderecos = signal<IEndereco[]>([]);
  readonly enderecosOrdenados = computed(() => {
    const list = this.enderecos();
    return [...list].sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0));
  });
  readonly enderecoEditandoId = signal<string | null>(null);
  readonly isLoadingEndereco = signal(false);

  readonly form = this.fb.group({
    phone: ['', [Validators.required]],
    cpf: [''],
    fullName: [''],
    email: [''],
    birthDate: [''],
    tipo: ['Primeira Compra'],
  });

  readonly formEndereco = this.fb.group({
    cep: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: [''],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    estado: ['', [Validators.required]],
  });

  readonly formEnderecoEdit = this.fb.group({
    cep: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: [''],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    estado: ['', [Validators.required]],
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
        this.loadEnderecos(id);
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

  private loadEnderecos(clienteId: string): void {
    this.enderecoService.getEnderecos(clienteId).subscribe({
      next: (response) => {
        this.enderecos.set(response.data);
      },
      error: () => {
        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível carregar os endereços do cliente.',
          icon: 'error',
          confirmButtonColor: 'var(--primary)',
        });
      },
    });
  }

  addEndereco(): void {
    if (this.formEndereco.invalid || this.isLoadingEndereco()) return;

    const id = this.clienteId();
    if (!id) return;

    this.isLoadingEndereco.set(true);
    const payload = this.formEndereco.value as Omit<IEndereco, 'id' | 'createdAt' | 'updatedAt' | 'clienteId' | 'principal'>;

    this.enderecoService.createEndereco(id, payload).subscribe({
      next: () => {
        this.isLoadingEndereco.set(false);
        this.formEndereco.reset();
        this.loadEnderecos(id);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Endereço adicionado com sucesso.',
          icon: 'success',
          confirmButtonColor: 'var(--primary)',
        });
      },
      error: (err) => {
        this.isLoadingEndereco.set(false);
        const message = err?.error?.message || 'Ocorreu um erro ao adicionar o endereço.';
        Swal.fire({
          title: 'Erro',
          text: message,
          icon: 'error',
          confirmButtonColor: 'var(--primary)',
        });
      },
    });
  }

  selectPrincipal(enderecoId: string): void {
    const id = this.clienteId();
    if (!id) return;

    Swal.fire({
      title: 'Selecionar endereço?',
      text: 'Deseja definir este endereço como principal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--gray-020)',
      confirmButtonText: 'Sim, selecionar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.enderecoService.selectPrincipal(id, enderecoId).subscribe({
        next: () => {
          this.loadEnderecos(id);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Endereço principal selecionado com sucesso.',
            icon: 'success',
            confirmButtonColor: 'var(--primary)',
          });
        },
        error: (err) => {
          const message = err?.error?.message || 'Ocorreu um erro ao selecionar o endereço principal.';
          Swal.fire({
            title: 'Erro',
            text: message,
            icon: 'error',
            confirmButtonColor: 'var(--primary)',
          });
        },
      });
    });
  }

  deleteEndereco(enderecoId: string): void {
    const id = this.clienteId();
    if (!id) return;

    Swal.fire({
      title: 'Deletar endereço?',
      text: 'Deseja remover este endereço? Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--gray-020)',
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.enderecoService.deleteEndereco(id, enderecoId).subscribe({
        next: () => {
          this.loadEnderecos(id);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Endereço removido com sucesso.',
            icon: 'success',
            confirmButtonColor: 'var(--primary)',
          });
        },
        error: (err) => {
          const message = err?.error?.message || 'Ocorreu um erro ao remover o endereço.';
          Swal.fire({
            title: 'Erro',
            text: message,
            icon: 'error',
            confirmButtonColor: 'var(--primary)',
          });
        },
      });
    });
  }

  startEdit(endereco: IEndereco): void {
    this.enderecoEditandoId.set(endereco.id);
    this.formEnderecoEdit.patchValue({
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
    });
  }

  cancelEdit(): void {
    this.enderecoEditandoId.set(null);
    this.formEnderecoEdit.reset();
  }

  saveEdit(enderecoId: string): void {
    if (this.formEnderecoEdit.invalid || this.isLoadingEndereco()) return;

    const id = this.clienteId();
    if (!id) return;

    this.isLoadingEndereco.set(true);
    const payload = this.formEnderecoEdit.value as Omit<IEndereco, 'id' | 'createdAt' | 'updatedAt' | 'clienteId' | 'principal'>;

    this.enderecoService.updateEndereco(id, enderecoId, payload).subscribe({
      next: () => {
        this.isLoadingEndereco.set(false);
        this.enderecoEditandoId.set(null);
        this.formEnderecoEdit.reset();
        this.loadEnderecos(id);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Endereço atualizado com sucesso.',
          icon: 'success',
          confirmButtonColor: 'var(--primary)',
        });
      },
      error: (err) => {
        this.isLoadingEndereco.set(false);
        const message = err?.error?.message || 'Ocorreu um erro ao atualizar o endereço.';
        Swal.fire({
          title: 'Erro',
          text: message,
          icon: 'error',
          confirmButtonColor: 'var(--primary)',
        });
      },
    });
  }

  salvarECriarPedido(): void {
    if (this.form.invalid || this.isLoading()) return;

    Swal.fire({
      title: 'Salvar e criar pedido?',
      text: 'Deseja salvar as alterações e criar um novo pedido para este cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--gray-020)',
      confirmButtonText: 'Sim, salvar e criar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this._doSubmit(true);
    });
  }

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    Swal.fire({
      title: 'Salvar alterações?',
      text: 'Deseja salvar as alterações do cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--gray-020)',
      confirmButtonText: 'Sim, salvar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this._doSubmit(false);
    });
  }

  private _doSubmit(criarPedido: boolean): void {
    this.isLoading.set(true);

    const id = this.clienteId();
    const payload = this.form.value as Omit<IClientes, 'id' | 'createdAt' | 'updatedAt'>;

    const request$ = id
      ? this.clientesService.updateCliente(id, payload)
      : this.clientesService.createCliente(payload);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        if (criarPedido) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Cliente salvo. Agora você será redirecionado para criar o pedido.',
            icon: 'success',
            confirmButtonColor: 'var(--primary)',
          }).then(() => {
            this.router.navigate(['/admin/pedidos/create']);
          });
        } else {
          Swal.fire({
            title: 'Sucesso!',
            text: id ? 'Cliente atualizado com sucesso.' : 'Cliente cadastrado com sucesso.',
            icon: 'success',
            confirmButtonColor: 'var(--primary)',
          }).then(() => {
            this.router.navigate(['/admin/clientes']);
          });
        }
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
