import { inject } from '@angular/core';
import {
    Routes, Route, UrlSegment, ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { AuthGuard } from 'app-shared';

/* eslint-disable max-len */
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes'),
        canMatch: [
            (route: Route, segments: UrlSegment[]): Promise<boolean> => {
                return inject(AuthGuard).canLoad(route, segments);
            }
        ],
        canActivate: [
            (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
                return inject(AuthGuard).canActivate(route, state);
            }
        ],
        data: { },
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.routes'), // eslint-disable-line max-len
        canMatch: [
            (route: Route, segments: UrlSegment[]): Promise<boolean> => {
                return inject(AuthGuard).canLoad(route, segments);
            }
        ],
        canActivate: [
            (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
                return inject(AuthGuard).canActivate(route, state);
            }
        ],
        data: { }
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.routes'),
        canMatch: []
    }
];
/* eslint-enable max-len */
