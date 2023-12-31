import { Inject, Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpEvent, HttpRequest, HttpHandler
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { API_ROOT } from './inject-tokens';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(
        @Inject(API_ROOT) private apiRoot: string,
        private account: AccountService
    ) { }

    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (req.url.startsWith(this.apiRoot) ||
            req.url.startsWith(makeAbsoluteUrl(this.apiRoot))
        ) { // eslint-disable-line max-len
            const setHeaders: { [key: string]: string } = {
                'X-Requested-With': 'XMLHttpRequest'
            };
            if (!!this.account.token) {
                this.account.addAuthTokenTo(setHeaders);
            }
            req = req.clone({setHeaders});
        }
        return next.handle(req);
    }

}

export function makeAbsoluteUrl(url: string): string {
    const u = new URL(url, window.self.location.href);
    return u.toString();
}
