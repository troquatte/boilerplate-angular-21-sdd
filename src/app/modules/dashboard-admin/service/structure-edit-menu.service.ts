import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interfaces
import { IStructureCourseEditMenuEntity } from '../../../../server/modules/structure-edit-menu/interface/IStructureCourseEditMenuEntity.interface';

// Services
import { StructureService } from './structure.service';

@Injectable({
  providedIn: 'root',
})
export class StructureEditMenuService {
  #http = inject(HttpClient);
  #structureService = inject(StructureService);
  #apiUrl = `${environment.apiUrl}/structure-edit-menu`;

  public read$(
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCourseEditMenuEntity> {
    console.log(structure_id, course_id);
    return this.#http
      .get<{
        data: IStructureCourseEditMenuEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`)
      .pipe(this.#refreshAfterChange(structure_id));
  }

  public update$(
    payload: IStructureCourseEditMenuEntity,
    structure_id: string,
    course_id: string,
  ): Observable<IStructureCourseEditMenuEntity> {
    return this.#http
      .put<{
        data: IStructureCourseEditMenuEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, { ...payload })
      .pipe(this.#refreshAfterChange(structure_id));
  }

  #refreshAfterChange<T>(structure_id: string) {
    return (source$: Observable<{ data: T }>): Observable<T> => {
      return source$.pipe(
        map((res) => res.data),
        switchMap((created: T) => {
          // this.#structureService.clearCache();
          return this.#structureService
            .read$(structure_id)
            .pipe(map(() => created));
        }),
        catchError((error: HttpErrorResponse) => throwError(() => error)),
      );
    };
  }
}
