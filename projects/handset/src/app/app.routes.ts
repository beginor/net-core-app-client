import { Routes } from '@angular/router';

import { matchAfterAuth, activateAfterAuth } from 'app-shared';

/* eslint-disable max-len */
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes'),
        canMatch: [matchAfterAuth],
        canActivate: [activateAfterAuth],
        data: { },
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.routes'), // eslint-disable-line max-len
        canMatch: [matchAfterAuth],
        canActivate: [activateAfterAuth],
        data: { }
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.routes'),
        canMatch: []
    }
];
/* eslint-enable max-len */
