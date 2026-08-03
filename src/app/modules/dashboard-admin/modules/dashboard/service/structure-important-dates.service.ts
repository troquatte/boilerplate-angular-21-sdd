import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

// Interfaces
import { IStructureCourseImportantDatesEntity } from '../../../../server/modules/structure-important-dates/interface/IStructureCourseImportantDatesEntity.interface';

// Service
import { StructureService } from './structure.service';

@Injectable({
  providedIn: 'root',
})
export class StructureImportantDatesService {
  #http = inject(HttpClient);
  #structureService = inject(StructureService);
  #apiUrl = `${environment.apiUrl}/structure-important-dates`;

  public read$(
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCourseImportantDatesEntity> {
    return this.#http
      .get<{
        data: IStructureCourseImportantDatesEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`)
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public update$(
    payload: IStructureCourseImportantDatesEntity,
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCourseImportantDatesEntity> {
    return this.#http
      .put<{
        data: IStructureCourseImportantDatesEntity;
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
