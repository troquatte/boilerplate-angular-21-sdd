import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly isAuthenticated = signal<boolean>(false);
  readonly currentUser = signal<User | null>(null);
  readonly isSessionLoaded = signal<boolean>(false);

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<void>('/api/auth/login', { email, password }, { withCredentials: true })
      .pipe(
        tap(() => this.isAuthenticated.set(true)),
        switchMap(() => this.getMe()),
      );
  }

  private readonly platformId = inject(PLATFORM_ID);

  getMe(): Observable<User> {
    if (isPlatformServer(this.platformId)) {
      this.isSessionLoaded.set(true);
      return of({} as User);
    }
    console.log('[DEBUG] AuthService.getMe() disparado no cliente');
    return this.http
      .get<{ data: User }>('/api/auth/me', { withCredentials: true })
      .pipe(
        map((res) => res.data),
        tap((user) => {
          console.log('[DEBUG] AuthService.getMe() sucesso, populando:', user);
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          this.isSessionLoaded.set(true);
        }),
        catchError((err) => {
          console.log('[DEBUG] AuthService.getMe() erro no cliente:', err);
          this.isSessionLoaded.set(true);
          return throwError(() => err);
        }),
      );
  }

  register(name: string, email: string, password: string, role = 'CLIENT'): Observable<void> {
    return this.http.post<void>(
      '/api/auth/register',
      { name, email, password, role },
      { withCredentials: true },
    );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>('/api/auth/logout', {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAuthenticated.set(false);
          this.currentUser.set(null);
          this.isSessionLoaded.set(true);
        }),
      );
  }

  refresh(): Observable<void> {
    return this.http
      .post<void>('/api/auth/refresh', {}, { withCredentials: true })
      .pipe(tap(() => this.isAuthenticated.set(true)));
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>('/api/auth/forgot-password', { email }, { withCredentials: true });
  }

  resetPassword(email: string, secret: string, password: string): Observable<void> {
    return this.http.post<void>(
      '/api/auth/reset-password',
      { email, secret, password },
      { withCredentials: true },
    );
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<{ data: User[] }>('/api/admin/users', { withCredentials: true })
      .pipe(map((res) => res.data));
  }
}
