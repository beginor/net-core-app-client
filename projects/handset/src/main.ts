import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh-Hans';
import zhEx from '@angular/common/locales/extra/zh-Hans';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

const params = new URLSearchParams(self.location.search);
const tmpToken = params.get('tmpToken');
if (tmpToken) {
    sessionStorage.setItem('tmpToken', tmpToken);
}

registerLocaleData(zh, 'zh-Hans', zhEx);

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
