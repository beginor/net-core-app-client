import { APP_BASE_HREF } from '@angular/common';
import {
    ErrorHandler, LOCALE_ID, inject, ApplicationConfig
} from '@angular/core';
import {
    HTTP_INTERCEPTORS, provideHttpClient, withFetch
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import {
    ApiInterceptor, HttpErrorHandler, isProd, CONTEXT_ROOT,
    API_ROOT, IS_PRODUCTION,
} from 'app-shared';

import { routes } from './app-routing.module';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withFetch()),
        provideAnimations(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: 'zh-Hans'
        },
        {
            provide: CONTEXT_ROOT,
            useValue: '/net-core-app'
        },
        {
            provide: APP_BASE_HREF,
            useFactory: (): string => {
                const contextRoot = inject(CONTEXT_ROOT);
                return `${contextRoot}/handset/`;
            },
        },
        {
            provide: API_ROOT,
            useFactory: (): string => {
                const contextRoot = inject(CONTEXT_ROOT);
                return `${contextRoot}/api`;
            },
        },
        {
            provide: IS_PRODUCTION,
            useFactory: isProd
        },
        {
            provide: ErrorHandler,
            useClass: HttpErrorHandler
        },
    ]
};
