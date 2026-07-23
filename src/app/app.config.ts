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
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { environment } from '../environments/environment.development';
import { WINDOW, windowProvider } from '../providers/window.provider';
import { routes } from './app.routes';

const maskConfig: any = {
  thousandSeparator: '.',
  decimalMarker: ',',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([])),
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
  ],
};
