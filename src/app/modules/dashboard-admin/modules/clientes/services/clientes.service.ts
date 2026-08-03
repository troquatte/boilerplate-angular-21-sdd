import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClientes } from '../interfaces/clientes.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/dashboard/clientes';

  getClientes(): Observable<{ data: IClientes[] }> {
    return this.http.get<{ data: IClientes[] }>(this.apiUrl);
  }
}
