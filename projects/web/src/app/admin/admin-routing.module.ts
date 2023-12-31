import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
/* eslint-disable max-len */
const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
    },
    {
        path: 'privileges',
        loadChildren: () => import('./privileges/privileges.module').then(m => m.PrivilegesModule)
    },
    {
        path: 'audit-logs',
        loadChildren: () => import('./audit-logs/audit-logs.module').then(m => m.AuditLogsModule)
    },
    {
        path: 'nav-items',
        loadChildren: () => import('./nav-items/nav-items.module').then(m => m.NavItemsModule)
    },
    {
        path: 'storages',
        loadChildren: () => import('./storages/storages.module').then(m => m.AppStorageModule)
    },
    {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.AppLogModule)
    },
    {
        path: 'organize-units',
        loadChildren: () => import('./organize-units/organize-units.module').then(m => m.OrganizeUnitModule)
    }
];
/* eslint-enable max-len */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
