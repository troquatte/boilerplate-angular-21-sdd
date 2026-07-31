import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Environment
import { environment } from '../../../../environments/environment';

// Interfaces
import {
  IStructureDisciplinesEntity,
  IStructureDisciplinesItensEntity,
} from '../../../../server/modules/structure-disciplines/interface/IStructureDisciplinesEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureDisciplinesService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-disciplines`;
  #cacheRead: Map<string, IStructureDisciplinesItensEntity> = new Map();

  public updateOrder$(
    structure_id: string,
    course_id: string,
    payload: Array<IStructureDisciplinesItensEntity>,
  ): Observable<{ itens: Array<IStructureDisciplinesItensEntity> }> {
    return this.#http
      .put<{
        data: { itens: Array<IStructureDisciplinesItensEntity> };
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`, payload)
      .pipe(
        map((res) => {
          this.clearCache();
          return res.data;
        }),
      );
  }

  public list$(
    structure_id: string,
    course_id: string,
  ): Observable<IStructureDisciplinesEntity> {
    return this.#http
      .get<{
        data: IStructureDisciplinesEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}`)
      .pipe(
        map((res) => {
          this.clearCache();
          return res.data;
        }),
      );
  }

  public clearCache(): void {
    this.#cacheRead.clear();
    console.log('Cache cleared.');
  }
}
