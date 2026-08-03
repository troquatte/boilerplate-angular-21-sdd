import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IDisciplinesChapterEntity } from '../../../../server/modules/disciplines-chapter/interface/IDisciplinesChapterEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class DisciplineChapterService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/disciplines-chapter`;

  public create$(
    disciplines_id: string,
    payload: Omit<
      IDisciplinesChapterEntity,
      'createdAt' | 'updatedAt' | 'disciplines_id'
    >,
  ): Observable<IDisciplinesChapterEntity> {
    return this.#http
      .post<{
        data: IDisciplinesChapterEntity;
      }>(`${this.#apiUrl}/${disciplines_id}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    disciplines_id: string,
    disciplines_chapter_id: string,
  ): Observable<IDisciplinesChapterEntity> {
    return this.#http
      .get<{
        data: IDisciplinesChapterEntity;
      }>(`${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public list$(
    disciplines_id: string,
  ): Observable<Array<IDisciplinesChapterEntity>> {
    return this.#http
      .get<{
        data: Array<IDisciplinesChapterEntity>;
      }>(`${this.#apiUrl}/${disciplines_id}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    disciplines_id: string,
    disciplines_chapter_id: string,
    payload: Omit<
      IDisciplinesChapterEntity,
      'createdAt' | 'updatedAt' | 'disciplines_id'
    >,
  ): Observable<IDisciplinesChapterEntity> {
    return this.#http
      .put<{
        data: IDisciplinesChapterEntity;
      }>(`${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public updateOrder$(
    disciplines_id: string,
    payload: Omit<
      Array<IDisciplinesChapterEntity>,
      'createdAt' | 'updatedAt' | 'disciplines_id'
    >,
  ): Observable<Array<IDisciplinesChapterEntity>> {
    return this.#http
      .put<{
        data: Array<IDisciplinesChapterEntity>;
      }>(`${this.#apiUrl}/order/${disciplines_id}`, [...payload])
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    disciplines_chapter_id: string,
    disciplines_id: string,
  ): Observable<Array<IDisciplinesChapterEntity>> {
    return this.#http
      .delete<{
        data: Array<IDisciplinesChapterEntity>;
      }>(`${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}`)
      .pipe(map((res) => res.data));
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
