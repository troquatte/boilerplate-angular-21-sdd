import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { ViaCepResponse } from './viacep.interface';

@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  buscarCep(cep: string): Observable<ViaCepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');
    return from(
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`).then((res) => res.json()),
    ).pipe(
      map((response: ViaCepResponse) => {
        if (response.erro) {
          throw new Error('CEP não encontrado');
        }
        return response;
      }),
    );
  }
}
