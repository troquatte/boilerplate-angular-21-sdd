import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { ICourseStructureTimelineDaysEntity } from '../../../../server/modules/structure-timeline-days/interface/ICourseStructureTimelineDaysEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureTimelineDaysService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-timeline-days`;

  public create$(
    payload: Omit<
      ICourseStructureTimelineDaysEntity,
      'dayIndex' | 'createdAt' | 'updatedAt' | 'structure_id'
    >,
    structure_id: string,
    course_id: string,
    timeline_id: string,
  ): Observable<ICourseStructureTimelineDaysEntity> {
    return this.#http
      .post<{
        data: ICourseStructureTimelineDaysEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
    timeline_id: string,
    timeline_day_id: string,
  ): Observable<ICourseStructureTimelineDaysEntity> {
    return this.#http
      .get<{
        data: ICourseStructureTimelineDaysEntity;
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}/${timeline_day_id}`,
      )
      .pipe(this.#refreshAfterChange());
  }

  public list$(
    structure_id: string,
    course_id: string,
    timeline_id: string,
  ): Observable<{
    items: Array<ICourseStructureTimelineDaysEntity>;
    page: number;
    pageSize: number;
  }> {
    return this.#http
      .get<{
        data: {
          items: Array<ICourseStructureTimelineDaysEntity>;
          page: number;
          pageSize: number;
        };
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}/${timeline_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public update$(
    payload: Omit<
      ICourseStructureTimelineDaysEntity,
      'dayIndex' | 'description' | 'createdAt' | 'updatedAt' | 'structure_id'
    >,
    structure_id: string,
    course_id: string,
    timeline_id: string,
    timeline_day_id: string,
  ): Observable<{
    id: string;
    items: Array<ICourseStructureTimelineDaysEntity>;
    page: number;
    pageSize: number;
  }> {
    return this.#http
      .put<{
        data: {
          id: string;
          items: Array<ICourseStructureTimelineDaysEntity>;
          page: number;
          pageSize: number;
        };
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}/${timeline_day_id}`,
        {
          ...payload,
        },
      )
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
    timeline_id: string,
    timeline_day_id: string,
  ): Observable<{
    items: Array<ICourseStructureTimelineDaysEntity>;
    page: number;
    pageSize: number;
  }> {
    return this.#http
      .delete<{
        data: {
          items: Array<ICourseStructureTimelineDaysEntity>;
          page: number;
          pageSize: number;
        };
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}/${timeline_day_id}`,
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
