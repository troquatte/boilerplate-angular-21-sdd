import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICourseStructureTimelineDaysEntity } from '../../../../server/modules/structure-timeline-days/interface/ICourseStructureTimelineDaysEntity.interface';
import { ICourseStructureTimelineEntity } from '../../../../server/modules/structure-timeline/interface/ICourseStructureTimelineEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureTimelineService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-timeline`;

  public create$(
    payload: Omit<
      ICourseStructureTimelineEntity,
      'createdAt' | 'updatedAt' | 'structure_id'
    >,
    structure_id: string,
    course_id: string,
  ): Observable<ICourseStructureTimelineEntity> {
    return this.#http
      .post<{
        data: ICourseStructureTimelineEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
    timeline_id: string,
  ): Observable<ICourseStructureTimelineEntity> {
    return this.#http
      .get<{
        data: ICourseStructureTimelineEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}`)
      .pipe(this.#refreshAfterChange());
  }

  public list$(
    structure_id: string,
    course_id: string,
  ): Observable<Array<ICourseStructureTimelineEntity>> {
    return this.#http
      .get<{
        data: Array<ICourseStructureTimelineEntity>;
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    payload: Omit<
      ICourseStructureTimelineEntity,
      'createdAt' | 'updatedAt' | 'structure_id'
    >,
    structure_id: string,
    course_id: string,
    timeline_id: string,
  ): Observable<Array<ICourseStructureTimelineDaysEntity>> {
    return this.#http
      .put<{
        data: Array<ICourseStructureTimelineDaysEntity>;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
    timeline_id: string,
  ): Observable<Array<ICourseStructureTimelineEntity>> {
    return this.#http
      .delete<{
        data: Array<ICourseStructureTimelineEntity>;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${timeline_id}`)
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
