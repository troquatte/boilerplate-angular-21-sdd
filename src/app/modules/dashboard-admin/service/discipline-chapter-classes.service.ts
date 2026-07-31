import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDisciplinesChapterClassesEntity } from '../../../../server/modules/disciplines-chapter-classes/interface/IDisciplinesChapterClassesEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class DisciplineChapterClassesService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/disciplines-chapter-classes`;

  public create$(
    disciplines_id: string,
    disciplines_chapter_id: string,
    payload: Omit<
      IDisciplinesChapterClassesEntity,
      'createdAt' | 'updatedAt' | 'disciplines_id' | 'disciplines_chapter_id'
    >,
  ): Observable<IDisciplinesChapterClassesEntity> {
    return this.#http
      .post<{
        data: IDisciplinesChapterClassesEntity;
      }>(`${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    disciplines_id: string,
    disciplines_chapter_id: string,
    disciplines_chapter_classes_id: string,
  ): Observable<IDisciplinesChapterClassesEntity> {
    return this.#http
      .get<{
        data: IDisciplinesChapterClassesEntity;
      }>(
        `${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}/${disciplines_chapter_classes_id}`,
      )
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public list$(
    disciplines_id: string,
    disciplines_chapter_id: string,
  ): Observable<Array<IDisciplinesChapterClassesEntity>> {
    return this.#http
      .get<{
        data: Array<IDisciplinesChapterClassesEntity>;
      }>(`${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    disciplines_id: string,
    disciplines_chapter_id: string,
    disciplines_chapter_classes_id: string,
    payload: Omit<
      IDisciplinesChapterClassesEntity,
      | 'createdAt'
      | 'updatedAt'
      | 'disciplines_id'
      | 'disciplines_chapter_id'
      | 'disciplines_chapter_classes_id'
    >,
  ): Observable<IDisciplinesChapterClassesEntity> {
    return this.#http
      .put<{
        data: IDisciplinesChapterClassesEntity;
      }>(
        `${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}/${disciplines_chapter_classes_id}`,
        {
          ...payload,
        },
      )
      .pipe(this.#refreshAfterChange());
  }

  public updateOrder$(
    disciplines_id: string,
    disciplines_chapter_id: string,
    payload: Omit<
      Array<IDisciplinesChapterClassesEntity>,
      'createdAt' | 'updatedAt' | 'disciplines_id'
    >,
  ): Observable<Array<IDisciplinesChapterClassesEntity>> {
    return this.#http
      .put<{
        data: Array<IDisciplinesChapterClassesEntity>;
      }>(`${this.#apiUrl}/order/${disciplines_id}/${disciplines_chapter_id}`, [
        ...payload,
      ])
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    disciplines_id: string,
    disciplines_chapter_id: string,
    disciplines_chapter_classes_id: string,
  ): Observable<Array<IDisciplinesChapterClassesEntity>> {
    return this.#http
      .delete<{
        data: Array<IDisciplinesChapterClassesEntity>;
      }>(
        `${this.#apiUrl}/${disciplines_id}/${disciplines_chapter_id}/${disciplines_chapter_classes_id}`,
      )
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
