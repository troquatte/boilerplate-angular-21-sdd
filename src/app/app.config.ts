import { ApplicationConfig, DOCUMENT, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Routes
import { provideImgixLoader } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './modules/auth/interceptors/auth.interceptor';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { environment } from '../environments/environment.development';
import { WINDOW, windowProvider } from '../providers/window.provider';
import { routes } from './app.routes';
import { APP_INITIALIZER } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from './modules/auth/services/auth.service';

const maskConfig: any = {
  thousandSeparator: '.',
  decimalMarker: ',',
};

function initializeAppFactory(authService: AuthService) {
  return () => authService.getMe().pipe(catchError(() => of(null)));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      }),
      withEventReplay(),
    ),
    provideEnvironmentNgxMask(maskConfig),
    provideImgixLoader(environment.MINIO.ASSETS),

    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true,
    },
  ],
};
