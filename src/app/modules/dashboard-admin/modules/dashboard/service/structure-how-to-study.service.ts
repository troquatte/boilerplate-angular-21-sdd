import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

import { IStructureCoursesHowToStudyEntity } from '../../../../server/modules/structure-how-to-study/interface/IStructureCoursesHowToStudyEntity.interface';
@Injectable({
  providedIn: 'root',
})
export class StructureHowToStudyService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-how-to-study`;

  public create$(
    payload: Omit<
      IStructureCoursesHowToStudyEntity,
      'createdAt' | 'updatedAt' | 'structure_id' | 'course_id'
    >,
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCoursesHowToStudyEntity> {
    return this.#http
      .post<{
        data: IStructureCoursesHowToStudyEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<IStructureCoursesHowToStudyEntity> {
    return this.#http
      .get<{
        data: IStructureCoursesHowToStudyEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}`)
      .pipe(this.#refreshAfterChange());
  }

  public list$(
    structure_id: string,
    course_id: string,
  ): Observable<Array<IStructureCoursesHowToStudyEntity>> {
    return this.#http
      .get<{
        data: Array<IStructureCoursesHowToStudyEntity>;
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    payload: Omit<
      IStructureCoursesHowToStudyEntity,
      'createdAt' | 'updatedAt' | 'structure_id' | 'course_id'
    >,
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<IStructureCoursesHowToStudyEntity> {
    return this.#http
      .put<{
        data: IStructureCoursesHowToStudyEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<Array<IStructureCoursesHowToStudyEntity>> {
    return this.#http
      .delete<{
        data: Array<IStructureCoursesHowToStudyEntity>;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}`)
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
