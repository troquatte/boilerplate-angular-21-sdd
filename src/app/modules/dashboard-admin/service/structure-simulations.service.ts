import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICourseStructureSimulatorsEntity } from '../../../../server/modules/structure-simulations/interface/ICourseStructureSimulatorsEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureSimulationsService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-simulations`;

  public create$(
    payload: Omit<
      ICourseStructureSimulatorsEntity,
      'createdAt' | 'updatedAt' | 'structure_id' | 'order'
    >,
    structure_id: string,
    course_id: string,
  ): Observable<ICourseStructureSimulatorsEntity> {
    return this.#http
      .post<{
        data: ICourseStructureSimulatorsEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<ICourseStructureSimulatorsEntity> {
    return this.#http
      .get<{
        data: ICourseStructureSimulatorsEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}`)
      .pipe(this.#refreshAfterChange());
  }

  public list$(
    structure_id: string,
    course_id: string,
  ): Observable<Array<ICourseStructureSimulatorsEntity>> {
    return this.#http
      .get<{
        data: Array<ICourseStructureSimulatorsEntity>;
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}`)
      .pipe(map((res) => res.data));
  }

  public updateOrder$(
    items: ICourseStructureSimulatorsEntity[],
    structure_id: string,
    course_id: string,
  ): Observable<boolean> {
    return this.#http
      .put<{
        success: boolean;
        data: any;
      }>(`${this.#apiUrl}/order/${structure_id}/${course_id}`, items)
      .pipe(map((res) => res.success));
  }

  public update$(
    payload: Omit<
      ICourseStructureSimulatorsEntity,
      'createdAt' | 'updatedAt' | 'structure_id' | 'order'
    >,
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<ICourseStructureSimulatorsEntity> {
    return this.#http
      .put<{
        data: ICourseStructureSimulatorsEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<Array<ICourseStructureSimulatorsEntity>> {
    return this.#http
      .delete<{
        data: Array<ICourseStructureSimulatorsEntity>;
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
