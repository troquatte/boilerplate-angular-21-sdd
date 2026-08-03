import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

interface AdminContact {
  email: string;
  tel: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminContactService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/admin-contact`;

  public createOrUpdate$(payload: AdminContact): Observable<AdminContact> {
    return this.#http
      .post<{ data: AdminContact }>(this.#apiUrl, payload)
      .pipe(this.#handleResponse());
  }

  public read$(): Observable<AdminContact> {
    return this.#http
      .get<{ data: AdminContact }>(this.#apiUrl)
      .pipe(this.#handleResponse());
  }

  #handleResponse<T>() {
    return (source$: Observable<{ data: T }>): Observable<T> => {
      return source$.pipe(
        map((res) => res.data),
        catchError((error: HttpErrorResponse) => throwError(() => error)),
      );
    };
  }
}
