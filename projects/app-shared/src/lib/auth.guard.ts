import { ErrorHandler, inject } from '@angular/core';
import {
    Route, UrlSegment, ActivatedRouteSnapshot,
    RouterStateSnapshot, CanActivateFn, CanMatchFn
} from '@angular/router';

import { AccountService } from './account.service';

export const matchAfterAuth: CanMatchFn = (
    route: Route, // eslint-disable-line @typescript-eslint/no-unused-vars
    segments: UrlSegment[] // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<boolean> => {
    const account = inject(AccountService);
    const errorHandler = inject(ErrorHandler);
    return account.getInfo().then(info => !!info.id).catch(ex => {
        errorHandler.handleError(ex);
        return false;
    });
}

export const activateAfterAuth: CanActivateFn = (
    route: ActivatedRouteSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<boolean> => {
    const account = inject(AccountService);
    const errorHandler = inject(ErrorHandler);
    return account.getInfo().then(info => !!info.id).catch(ex => {
        errorHandler.handleError(ex);
        return false;
    });
};
