import { ErrorHandler, inject } from '@angular/core';
import {
    Route, UrlSegment, ActivatedRouteSnapshot,
    RouterStateSnapshot, CanActivateFn, CanMatchFn
} from '@angular/router';
import { map, catchError, Observable } from 'rxjs';

import { AccountService } from './account.service';

export const matchAfterAuth: CanMatchFn = (
    route: Route, // eslint-disable-line @typescript-eslint/no-unused-vars
    segments: UrlSegment[] // eslint-disable-line @typescript-eslint/no-unused-vars
): Observable<boolean> => {
    const account = inject(AccountService);
    const errorHandler = inject(ErrorHandler);
    return account.getAccountInfo().pipe(
        map(info => !!info.id),
        catchError(err => {
            errorHandler.handleError(err);
            throw err;
        })
    );
}

export const activateAfterAuth: CanActivateFn = (
    route: ActivatedRouteSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot // eslint-disable-line @typescript-eslint/no-unused-vars
): Observable<boolean> => {
    const account = inject(AccountService);
    const errorHandler = inject(ErrorHandler);
    return account.getAccountInfo().pipe(
        map(info => !!info.id),
        catchError(err => {
            errorHandler.handleError(err);
            throw err;
        })
    );
};
