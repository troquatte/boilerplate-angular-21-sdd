import { inject, Injectable } from '@angular/core';
// Interfaces
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ERoles } from '../../../../server/modules/user/enum/ERoles.enum';
import { IUserEntity } from '../../../../server/modules/user/interface/IUser.interface';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/user`;

  public create$(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Observable<IUserEntity> {
    const payload = {
      name,
      email,
      password,
      role,
    };

    return this.#http
      .post<{
        data: IUserEntity;
      }>(`${this.#apiUrl}`, { ...payload })
      .pipe(this.#refreshAfterChange());
  }

  public readForUpdate$(user_id: string): Observable<IUserEntity> {
    return this.#http
      .get<{
        data: IUserEntity;
      }>(`${this.#apiUrl}/read-for-update/${user_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  public list$(
    email: string | undefined = undefined,
    role:
      | ERoles.ADMIN
      | ERoles.STUDENT
      | ERoles.TEACHER
      | undefined = undefined,
  ): Observable<{
    items: Array<IUserEntity>;
  }> {
    let queryParams = new HttpParams();

    if (email) {
      queryParams = queryParams.set('email', email);
    }

    if (role) {
      queryParams = queryParams.set('role', role);
    }

    return this.#http
      .get<{
        data: {
          items: Array<IUserEntity>;
          page: number;
          pageSize: number;
        };
      }>(`${this.#apiUrl}/list/`, {
        params: queryParams,
      })
      .pipe(map((res) => res.data));
  }

  public update$(
    user_id: string,
    name: string,
    deleteUser: boolean,
    role: string,
  ): Observable<IUserEntity> {
    return this.#http
      .put<{
        data: IUserEntity;
      }>(`${this.#apiUrl}/${user_id}`, { name, deleteUser, role })
      .pipe(this.#refreshAfterChange());
  }

  public delete$(id: string, user_id: string): Observable<IUserEntity> {
    return this.#http
      .delete<{
        data: IUserEntity;
      }>(`${this.#apiUrl}/${id}/${user_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
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
