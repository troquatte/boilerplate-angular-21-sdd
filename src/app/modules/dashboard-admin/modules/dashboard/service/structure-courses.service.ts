import { inject, Injectable } from '@angular/core';
// Interfaces
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { ICourseStructureCourseEntity } from '../../../../server/modules/structure-courses/interface/ICourseStructureCourseEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureCoursesService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-courses`;

  public create$(
    payload: Omit<ICourseStructureCourseEntity, 'createdAt' | 'updatedAt'>,
    structure_id: string,
  ): Observable<ICourseStructureCourseEntity> {
    return this.#http
      .post<{
        data: ICourseStructureCourseEntity;
      }>(`${this.#apiUrl}/${structure_id}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
  ): Observable<ICourseStructureCourseEntity> {
    return this.#http
      .get<{
        data: ICourseStructureCourseEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public list$(
    structure_id: string,
  ): Observable<Array<ICourseStructureCourseEntity>> {
    return this.#http
      .get<{
        data: Array<ICourseStructureCourseEntity>;
      }>(`${this.#apiUrl}/list/${structure_id}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    payload: Omit<ICourseStructureCourseEntity, 'createdAt' | 'updatedAt'>,
    structure_id: string,
    course_id: string,
  ): Observable<ICourseStructureCourseEntity> {
    return this.#http
      .put<{
        data: ICourseStructureCourseEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
  ): Observable<Array<ICourseStructureCourseEntity>> {
    return this.#http
      .delete<{
        data: Array<ICourseStructureCourseEntity>;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`)
      .pipe(map((res) => res.data));
  }

  public duplicate$(
    structure_id: string,
    course_id: string,
  ): Observable<Array<ICourseStructureCourseEntity>> {
    return this.#http
      .post<{
        data: Array<ICourseStructureCourseEntity>;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, {})
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
