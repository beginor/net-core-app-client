import { Routes } from '@angular/router';

import { matchAfterAuth, activateAfterAuth } from 'app-shared';

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
        loadChildren: () => import('./about/about.routes'),
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
