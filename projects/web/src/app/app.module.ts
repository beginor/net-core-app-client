import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, LOCALE_ID, ErrorHandler, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';

import {
    AppSharedModule, ApiInterceptor, HttpErrorHandler, isProd, CONTEXT_ROOT,
    API_ROOT,
} from 'app-shared';
import { AntdModule } from './antd.module';
import { NgbModule } from './ngb.module';
import { AppCommonModule } from './common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        AntdModule,
        NgbModule,
        AppSharedModule,
        AppCommonModule,
        AppRoutingModule
    ],
    providers: [
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
                return `${contextRoot}/web/`;
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
            provide: 'isProduction',
            useFactory: isProd
        },
        {
            provide: ErrorHandler,
            useClass: HttpErrorHandler
        },
        provideNzI18n(zh_CN),
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
