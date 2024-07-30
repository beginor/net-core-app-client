import { Routes } from '@angular/router';

import { matchAfterAuth, activateAfterAuth } from 'app-shared';

/* eslint-disable max-len */
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./home/home/home.component').then(m => m.HomeComponent),
        canMatch: [matchAfterAuth],
    },
    {
        path: 'about',
        loadComponent: () => import('./about/about/about.component').then(m => m.AboutComponent),
        canMatch: [matchAfterAuth],
        canActivate: [activateAfterAuth],
    },
    {
        path: 'about/:src',
        loadComponent: () => import('./common').then(m => m.IframeComponent),
        canMatch: []
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login/login.component').then(m => m.LoginComponent),
        canMatch: []
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.routes'),
        canMatch: [matchAfterAuth],
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes'),
        canMatch: [matchAfterAuth],
        canActivate: [activateAfterAuth],
    }
];
/* eslint-enable max-len */
