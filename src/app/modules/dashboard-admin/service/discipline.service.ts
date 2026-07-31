import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDisciplinesEntity } from '../../../../server/modules/disciplines/interface/IDisciplinesEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/disciplines`;

  public create$(
    payload: Omit<IDisciplinesEntity, 'createdAt' | 'updatedAt'>,
  ): Observable<IDisciplinesEntity> {
    return this.#http
      .post<{
        data: IDisciplinesEntity;
      }>(`${this.#apiUrl}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public read$(disciplines_id: string): Observable<IDisciplinesEntity> {
    return this.#http
      .get<{
        data: IDisciplinesEntity;
      }>(`${this.#apiUrl}/${disciplines_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public list$(): Observable<Array<IDisciplinesEntity>> {
    return this.#http
      .get<{
        data: Array<IDisciplinesEntity>;
      }>(`${this.#apiUrl}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    disciplines_id: string,
    payload: Omit<IDisciplinesEntity, 'createdAt' | 'updatedAt'>,
  ): Observable<IDisciplinesEntity> {
    return this.#http
      .put<{
        data: IDisciplinesEntity;
      }>(`${this.#apiUrl}/${disciplines_id}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    disciplines_id: string,
  ): Observable<Array<IDisciplinesEntity>> {
    return this.#http
      .delete<{
        data: Array<IDisciplinesEntity>;
      }>(`${this.#apiUrl}/${disciplines_id}`)
      .pipe(map((res) => res.data));
  }

  public listVideos$(disciplines_id: string) {
    return this.#http
      .get<{
        data: IDisciplinesEntity;
      }>(`${this.#apiUrl}/list-videos/${disciplines_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  #refreshAfterChange<T>() {
    return (source$: Observable<{ data: T }>): Observable<T> => {
      return source$.pipe(
        map((res) => res.data),
        catchError((error: HttpErrorResponse) => throwError(() => error)),
      );
    };
  }
}
