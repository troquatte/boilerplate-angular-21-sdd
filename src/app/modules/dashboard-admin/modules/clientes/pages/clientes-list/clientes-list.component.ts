import { Component, OnInit, inject, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { IClientes } from '../../interfaces/clientes.interface';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);

  readonly clientes = signal<IClientes[]>([]);

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe((data) => {
      this.clientes.set(data);
    });
  }

  onDelete(cliente: IClientes): void {
    Swal.fire({
      title: 'Confirmar exclusão',
      text: `Deseja deletar o cliente "${cliente.fullName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: 'var(--gray-030)',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deletar cliente:', cliente.id);
      }
    });
  }

  onEdit(cliente: IClientes): void {
    console.log('Editar cliente:', cliente.id);
  }
}
