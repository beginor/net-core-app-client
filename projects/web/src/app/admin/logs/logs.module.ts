import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { AntdModule } from '../../antd.module';
import { AppCommonModule } from '../../common';

import { AppLogRoutingModule } from './logs-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
    declarations: [
        ListComponent,
        DetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        AppSharedModule,
        AppCommonModule,
        AppLogRoutingModule
    ]
})
export class AppLogModule { }
