import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

// Interfaces
import { IStructureCourseLiveClassEntity } from '../../../../server/modules/structure-live-class/interface/IStructureCourseLiveClassEntity.interface';

// Services
import { StructureService } from './structure.service';

@Injectable({
  providedIn: 'root',
})
export class StructureLiveClassService {
  #http = inject(HttpClient);
  #structureService = inject(StructureService);
  #apiUrl = `${environment.apiUrl}/structure-live-class`;

  public read$(
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCourseLiveClassEntity> {
    return this.#http
      .get<{
        data: IStructureCourseLiveClassEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`)
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public update$(
    payload: IStructureCourseLiveClassEntity,
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCourseLiveClassEntity> {
    return this.#http
      .put<{
        data: IStructureCourseLiveClassEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, { ...payload })
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
