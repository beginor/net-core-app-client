import { Routes } from '@angular/router';

import { matchAfterAuth, activateAfterAuth } from 'app-shared';

import { IframeComponent } from './common/iframe/iframe.component';

/* eslint-disable max-len */
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes'),
        canMatch: [matchAfterAuth],
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.routes'),
        canMatch: [matchAfterAuth],
        canActivate: [activateAfterAuth],
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes'),
        canMatch: [matchAfterAuth],
        canActivate: [activateAfterAuth],
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.routes'),
        canMatch: []
    },
    {
        path: 'iframe/:src',
        component: IframeComponent,
        canMatch: []
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.routes'),
        canMatch: [matchAfterAuth],
    }
];
/* eslint-enable max-len */
