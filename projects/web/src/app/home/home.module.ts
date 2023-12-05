import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from 'app-shared';
import { NgbModule } from '../ngb.module';
import { AppCommonModule } from '../common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule,
        NgbModule,
        AppCommonModule,
        HomeRoutingModule
    ]
})
export default class HomeModule { }
