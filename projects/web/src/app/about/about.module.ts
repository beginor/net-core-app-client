import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from 'app-shared';
import { NgbModule } from '../ngb.module';
import { AppCommonModule } from '../common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';

@NgModule({
    declarations: [
        AboutComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule,
        NgbModule,
        AppCommonModule,
        AboutRoutingModule
    ]
})
export default class AboutModule { }
