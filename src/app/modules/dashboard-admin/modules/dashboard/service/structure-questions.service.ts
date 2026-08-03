import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

// Services
import { StructureService } from './structure.service';

// Interfaces
import { ICourseStructureQuestionEntity } from '../../../../server/modules/structure-questions/interface/ICourseStructureQuestionEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureQuestionsService {
  #http = inject(HttpClient);
  #structureService = inject(StructureService);
  #apiUrl = `${environment.apiUrl}/structure-questions`;

  public create$(
    structure_id: string,
    course_id: string,
    payload: Omit<ICourseStructureQuestionEntity, 'createdAt' | 'updatedAt'>,
  ): Observable<ICourseStructureQuestionEntity> {
    return this.#http
      .post<{
        data: ICourseStructureQuestionEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, { ...payload })
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public list$(
    structure_id: string,
    course_id: string,
    options?: {
      page?: number;
      pageSize?: number;
      discipline?: string;
      theme?: string;
      questions?: string[];
    },
  ): Observable<{
    items: Array<ICourseStructureQuestionEntity>;
    page: number;
    pageSize: number;
    total: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      discipline,
      theme,
      questions,
    } = options || {};

    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    let queryParams = params;

    if (discipline) {
      queryParams = queryParams.set('discipline', discipline);
    }

    if (theme) {
      queryParams = queryParams.set('theme', theme);
    }

    if (questions && questions.length > 0) {
      queryParams = queryParams.set('questions', questions.join(','));
    }

    return this.#http
      .get<{
        data: {
          items: Array<ICourseStructureQuestionEntity>;
          page: number;
          pageSize: number;
          total: number;
        };
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}`, {
        params: queryParams,
      })
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public read$(
    structure_id: string,
    course_id: string,
    question_id: string,
  ): Observable<ICourseStructureQuestionEntity> {
    return this.#http
      .get<{
        data: ICourseStructureQuestionEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${question_id}`)
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public update$(
    structure_id: string,
    course_id: string,
    question_id: string,
    payload: Omit<ICourseStructureQuestionEntity, 'createdAt' | 'updatedAt'>,
  ): Observable<ICourseStructureQuestionEntity> {
    return this.#http
      .put<{
        data: ICourseStructureQuestionEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${question_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public delete$(
    structure_id: string,
    course_id: string,
    question_id: string,
  ): Observable<{
    items: Array<ICourseStructureQuestionEntity>;
    page: number;
    pageSize: number;
  }> {
    return this.#http
      .delete<{
        data: {
          items: Array<ICourseStructureQuestionEntity>;
          page: number;
          pageSize: number;
        };
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${question_id}`)
      .pipe(this.#refreshAfterChange(structure_id));
  }

  #refreshAfterChange<T>(structure_id: string) {
    return (source$: Observable<{ data: T }>): Observable<T> => {
      return source$.pipe(
        map((res) => res.data),
        switchMap((created: T) => {
          this.#structureService.clearCache();
          return this.#structureService
            .read$(structure_id)
            .pipe(map(() => created));
        }),
        catchError((error: HttpErrorResponse) => throwError(() => error)),
      );
    };
  }
}
