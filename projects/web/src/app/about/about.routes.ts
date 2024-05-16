import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';

const routes: Routes = [
    {
        path: '',
        component: AboutComponent
    },
    {
        path: ':src',
        loadComponent: () => import('../common').then(m => m.IframeComponent),
        canMatch: []
    }
];

export default routes;
