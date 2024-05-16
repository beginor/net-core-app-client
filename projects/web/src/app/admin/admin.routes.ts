import { Routes } from '@angular/router';

/* eslint-disable max-len */
const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'users',
        loadComponent: () => import('./users/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'roles',
        loadComponent: () => import('./roles/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'privileges',
        loadComponent: () => import('./privileges/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'audit-logs',
        loadComponent: () => import('./audit-logs/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'nav-items',
        loadComponent: () => import('./nav-items/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'storages',
        loadComponent: () => import('./storages/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'logs',
        loadComponent: () => import('./logs/list/list.component').then(m => m.ListComponent)
    },
    {
        path: 'organize-units',
        loadComponent: () => import('./organize-units/list/list.component').then(m => m.ListComponent)
    }
];
/* eslint-enable max-len */
export default routes;
