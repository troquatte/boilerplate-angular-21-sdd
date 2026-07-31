import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICourseStructureSimulationsQuestionEntity } from '../../../../server/modules/structure-simulations-questions/interface/ICourseStructureSimulationsQuestionEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureSimulationsQuestionsService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-simulations-questions`;

  public create$(
    payload: Omit<
      ICourseStructureSimulationsQuestionEntity,
      'createdAt' | 'updatedAt' | 'structure_id'
    >,
    structure_id: string,
    course_id: string,
    simulation_id: string,
  ): Observable<ICourseStructureSimulationsQuestionEntity> {
    return this.#http
      .post<{
        data: ICourseStructureSimulationsQuestionEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${simulation_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
    simulation_id: string,
    question_id: string,
  ): Observable<ICourseStructureSimulationsQuestionEntity> {
    return this.#http
      .get<{
        data: ICourseStructureSimulationsQuestionEntity;
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${simulation_id}/${question_id}`,
      )
      .pipe(this.#refreshAfterChange());
  }

  public list$(
    structure_id: string,
    course_id: string,
    simulation_id: string,
    options?: {
      page?: number;
      pageSize?: number;
      discipline?: string;
    },
  ): Observable<{
    items: Array<ICourseStructureSimulationsQuestionEntity>;
    page: number;
    pageSize: number;
    total: number;
  }> {
    const { page = 1, pageSize = 10, discipline } = options || {};

    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    let queryParams = params;

    if (discipline) {
      queryParams = queryParams.set('discipline', discipline);
    }

    return this.#http
      .get<{
        data: {
          items: Array<ICourseStructureSimulationsQuestionEntity>;
          page: number;
          pageSize: number;
          total: number;
        };
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}/${simulation_id}`, {
        params: queryParams,
      })
      .pipe(map((res) => res.data));
  }

  public update$(
    payload: Omit<
      ICourseStructureSimulationsQuestionEntity,
      'createdAt' | 'updatedAt' | 'structure_id'
    >,
    structure_id: string,
    course_id: string,
    simulation_id: string,
    question_id: string,
  ): Observable<ICourseStructureSimulationsQuestionEntity> {
    return this.#http
      .put<{
        data: ICourseStructureSimulationsQuestionEntity;
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${simulation_id}/${question_id}`,
        {
          ...payload,
        },
      )
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
    simulation_id: string,
    question_id: string,
  ): Observable<{
    items: Array<ICourseStructureSimulationsQuestionEntity>;
    page: number;
    pageSize: number;
  }> {
    return this.#http
      .delete<{
        data: {
          items: Array<ICourseStructureSimulationsQuestionEntity>;
          page: number;
          pageSize: number;
        };
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${simulation_id}/${question_id}`,
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
