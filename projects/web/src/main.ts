import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh-Hans';
import zhEx from '@angular/common/locales/extra/zh-Hans';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

declare function isSupportedBrowser(): boolean;

if (isSupportedBrowser()) {
    const params = new URLSearchParams(self.location.search);
    const tmpToken = params.get('tmpToken');
    if (tmpToken) {
        sessionStorage.setItem('tmpToken', tmpToken);
    }
    registerLocaleData(zh, 'zh-Hans', zhEx);
    registerLocaleData(zh, 'zh-cn', zhEx);

    bootstrapApplication(AppComponent, appConfig)
        .then(() => {
            // console.log('app bootstrap');
        })
        .catch(err => {
            console.error(err);
        });
}
