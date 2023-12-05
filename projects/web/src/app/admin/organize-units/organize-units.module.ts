import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/antd.module';
import { NgbModule } from 'projects/web/src/app/ngb.module';
import { AppCommonModule } from 'projects/web/src/app/common';

import { OrganizeUnitRoutingModule } from './organize-units-routing.module';
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
        NgbModule,
        AppSharedModule,
        AppCommonModule,
        OrganizeUnitRoutingModule,
    ]
})
export class OrganizeUnitModule { }
