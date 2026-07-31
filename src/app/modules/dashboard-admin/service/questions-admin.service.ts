import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Services

// Interfaces
import { IQuestionsEntity } from '../../../../server/modules/questions-admin/interface/IQuestionsEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsAdminService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/questions-admin`;

  public list$(
    page: number = 1,
    pageSize: number = 10,
    answered: boolean | undefined = undefined,
  ): Observable<{
    items: Array<IQuestionsEntity>;
    page: number;
    pageSize: number;
    answered: boolean;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    let queryParams = params;

    if (answered !== undefined) {
      queryParams = queryParams.set('answered', answered);
    }

    return this.#http
      .get<{
        data: {
          items: Array<IQuestionsEntity>;
          page: number;
          pageSize: number;
          answered: boolean;
        };
      }>(`${this.#apiUrl}/list`, {
        params: queryParams,
      })
      .pipe(this.#refreshAfterChange());
  }

  public update$(
    question_id: string,
    payload: Omit<
      IQuestionsEntity,
      'answered' | 'createdAt' | 'updatedAt' | 'id'
    >,
  ): Observable<IQuestionsEntity> {
    return this.#http
      .put<{
        data: IQuestionsEntity;
      }>(`${this.#apiUrl}/${question_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
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
