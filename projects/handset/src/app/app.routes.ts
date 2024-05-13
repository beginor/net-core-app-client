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
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
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
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule), // eslint-disable-line max-len
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
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        canMatch: []
    }
];
/* eslint-enable max-len */
