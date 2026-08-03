import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

// Interfaces
import { map, Observable } from 'rxjs';
import { IUserStructureCoursePurchaseEntity } from '../../../../server/modules/user-structure-course-purchase/interface/IUserStructureCoursePurchaseEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class UserStructureCoursePurchaseService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/user-structure-course-purchase`;

  public create$(email: string, sku: string): Observable<{ email: string }> {
    return this.#http
      .post<{
        data: { email: string };
      }>(`${this.#apiUrl}/${sku}`, { email })
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public listUserIdAuth$(): Observable<
    Array<IUserStructureCoursePurchaseEntity>
  > {
    return this.#http
      .get<{
        data: Array<IUserStructureCoursePurchaseEntity>;
      }>(`${this.#apiUrl}`)
      .pipe(map((res) => res.data));
  }

  public listUserId$(
    user_id: string,
  ): Observable<Array<IUserStructureCoursePurchaseEntity>> {
    return this.#http
      .get<{
        data: Array<IUserStructureCoursePurchaseEntity>;
      }>(`${this.#apiUrl}/${user_id}`)
      .pipe(map((res) => res.data));
  }

  public delete$(
    user_id: string,
    course_purchase_id: string,
  ): Observable<Array<IUserStructureCoursePurchaseEntity>> {
    return this.#http
      .delete<{
        data: Array<IUserStructureCoursePurchaseEntity>;
      }>(`${this.#apiUrl}/${user_id}/${course_purchase_id}`)
      .pipe(map((res) => res.data));
  }
}
