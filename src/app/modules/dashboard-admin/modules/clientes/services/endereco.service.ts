import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEndereco } from '../interfaces/endereco.interface';

export interface IEnderecoResponse {
  data: IEndereco[];
}

export interface IEnderecoSingleResponse {
  data: IEndereco;
}

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private readonly http = inject(HttpClient);

  private apiUrl(clienteId: string): string {
    return `/api/dashboard/clientes/${clienteId}/enderecos`;
  }

  getEnderecos(clienteId: string): Observable<IEnderecoResponse> {
    return this.http.get<IEnderecoResponse>(this.apiUrl(clienteId));
  }

  createEndereco(
    clienteId: string,
    payload: Omit<IEndereco, 'id' | 'createdAt' | 'updatedAt' | 'clienteId' | 'principal'>,
  ): Observable<IEnderecoSingleResponse> {
    return this.http.post<IEnderecoSingleResponse>(this.apiUrl(clienteId), payload);
  }

  selectPrincipal(clienteId: string, enderecoId: string): Observable<IEnderecoSingleResponse> {
    return this.http.patch<IEnderecoSingleResponse>(`${this.apiUrl(clienteId)}/${enderecoId}/select`, {});
  }

  updateEndereco(
    clienteId: string,
    enderecoId: string,
    payload: Partial<Omit<IEndereco, 'id' | 'createdAt' | 'updatedAt' | 'clienteId'>>,
  ): Observable<IEnderecoSingleResponse> {
    return this.http.patch<IEnderecoSingleResponse>(`${this.apiUrl(clienteId)}/${enderecoId}`, payload);
  }

  deleteEndereco(clienteId: string, enderecoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(clienteId)}/${enderecoId}`);
  }
}
