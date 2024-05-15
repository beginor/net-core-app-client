import { inject, NgModule } from '@angular/core';
import {
    ActivatedRouteSnapshot, Route, RouterModule, RouterStateSnapshot, Routes,
    UrlSegment
} from '@angular/router';

import { AuthGuard, isProd } from 'app-shared';

import { IframeComponent } from './common';

/* eslint-disable max-len */
const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module'),
        canMatch: [],
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.module'),
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
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module'),
        canMatch: [
            (route: Route, segments: UrlSegment[]): Promise<boolean> => {
                return inject(AuthGuard).canLoad(route, segments);
            }
        ],
        canActivate: [
            (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
                return inject(AuthGuard).canActivate(route, state);
            }
        ]
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module'),
        canMatch: []
    },
    {
        path: 'iframe/:src',
        component: IframeComponent,
        canMatch: []
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.module'),
        canMatch: [
            (route: Route, segments: UrlSegment[]): Promise<boolean> => {
                return inject(AuthGuard).canLoad(route, segments);
            }
        ],
    }
];
/* eslint-enable max-len */
@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            { useHash: false, enableTracing: isProd() }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
