import { inject } from '@angular/core';
import {
    HttpRequest, HttpInterceptorFn, HttpHandlerFn
} from '@angular/common/http';

import { AccountService } from './account.service';
import { API_ROOT } from './inject-tokens';

export function makeAbsoluteUrl(url: string): string {
    const u = new URL(url, window.self.location.href);
    return u.toString();
}

export const apiInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const apiRoot = inject(API_ROOT);
    const account = inject(AccountService);
    if (req.url.startsWith(apiRoot) ||
        req.url.startsWith(makeAbsoluteUrl(apiRoot))
    ) {
        const setHeaders: Record<string, string> = {
            'X-Requested-With': 'XMLHttpRequest'
        };
        if (account.token()) {
            account.addAuthTokenTo(setHeaders);
        }
        req = req.clone({setHeaders});
    }
    return next(req);
}
