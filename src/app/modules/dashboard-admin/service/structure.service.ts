import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

// Interfaces
import { Router } from '@angular/router';
import { ERouters } from '@enums/routes';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ICourseStructureEntity } from '../../../../server/modules/structure/interface/ICourseStructure.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #apiUrl = `${environment.apiUrl}/structure`;

  #cacheRead: Map<string, ICourseStructureEntity> = new Map();
  #setStructure = signal<ICourseStructureEntity | null | undefined>(null);
  get getStructure(): Signal<ICourseStructureEntity | null | undefined> {
    return this.#setStructure.asReadonly();
  }

  constructor() {}

  public create$(
    payload: ICourseStructureEntity,
  ): Observable<ICourseStructureEntity> {
    this.#setStructure.set(null);

    return this.#http
      .post<{
        data: ICourseStructureEntity;
      }>(`${this.#apiUrl}`, { ...payload })
      .pipe(
        map((res) => {
          this.clearCache();
          this.#setStructure.set(res.data);
          this.#cacheRead.set('read', res.data);
          return res.data;
        }),
      );
  }

  public read$(structure_id: string): Observable<ICourseStructureEntity> {
    const cached = this.#cacheRead.get('read');

    if (cached && cached.id === structure_id) {
      return of(cached);
    }

    return this.#http
      .get<{ data: ICourseStructureEntity }>(`${this.#apiUrl}/${structure_id}`)
      .pipe(
        map((res) => {
          this.clearCache();
          this.#setStructure.set(res.data);
          this.#cacheRead.set('read', res.data);

          return res.data;
        }),
      );
  }

  public list$(): Observable<Array<ICourseStructureEntity>> {
    return this.#http
      .get<{ data: Array<ICourseStructureEntity> }>(`${this.#apiUrl}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    structure_id: string,
    payload: ICourseStructureEntity,
  ): Observable<ICourseStructureEntity> {
    return this.#http
      .put<{
        data: ICourseStructureEntity;
      }>(`${this.#apiUrl}/${structure_id}`, { ...payload })
      .pipe(
        map((res) => {
          this.clearCache();
          this.#setStructure.set(res.data);
          return res.data;
        }),
      );
  }

  public delete$(structure_id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/${structure_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.clearCache();
        this.#setStructure.set(null);
        this.#router.navigate([ERouters.NOT_FOUND]);
        return throwError(() => error);
      }),
    );
  }

  public duplicate$(
    structure_id: string,
  ): Observable<Array<ICourseStructureEntity>> {
    return this.#http
      .post<{
        data: Array<ICourseStructureEntity>;
      }>(`${this.#apiUrl}/${structure_id}`, {})
      .pipe(map((res) => res.data));
  }

  public clearCache(): void {
    this.#cacheRead.clear();
    console.log('Cache cleared.');
  }
}
