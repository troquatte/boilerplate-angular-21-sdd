import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClientes } from '../interfaces/clientes.interface';

interface IClientesMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface IClientesResponse {
  data: IClientes[];
  meta: IClientesMeta;
}

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/dashboard/clientes';

  getClientes(params: { page?: number; pageSize?: number; search?: string }): Observable<IClientesResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.search) query.set('search', params.search);

    const url = `${this.apiUrl}?${query.toString()}`;
    return this.http.get<IClientesResponse>(url);
  }
}
