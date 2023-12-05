import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from 'app-shared';
import { AppCommonModule } from '../common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        AppSharedModule,
        AppCommonModule,
        AdminRoutingModule
    ]
})
export default class AdminModule { }
