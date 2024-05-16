import { Routes } from '@angular/router';

import { IframeComponent } from '../common';

import { AboutComponent } from './about/about.component';

const routes: Routes = [
    {
        path: '',
        component: AboutComponent
    },
    {
        path: ':src',
        component: IframeComponent,
        canLoad: []
    }
];

export default routes;
