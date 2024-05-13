import { ErrorHandler, inject } from '@angular/core';
import {
    Route, UrlSegment, ActivatedRouteSnapshot,
    RouterStateSnapshot, CanActivateFn, CanMatchFn
} from '@angular/router';

import { AccountService } from './account.service';

export const matchAfterAuth: CanMatchFn = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: Route,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    segments: UrlSegment[]
): Promise<boolean> => {
    const account = inject(AccountService);
    const errorHandler = inject(ErrorHandler);
    return account.getInfo().then(info => !!info.id).catch(ex => {
        errorHandler.handleError(ex);
        return false;
    });
}

export const activateAfterAuth: CanActivateFn = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
): Promise<boolean> => {
    const account = inject(AccountService);
    const errorHandler = inject(ErrorHandler);
    return account.getInfo().then(info => !!info.id).catch(ex => {
        errorHandler.handleError(ex);
        return false;
    });
};
