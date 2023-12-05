﻿import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {
    NgbPaginationModule, NgbTooltipModule, NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NzTableModule } from 'ng-zorro-antd/table';
// import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';


import { AppSharedModule } from 'app-shared';
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
        NgbPaginationModule,
        NgbTooltipModule,
        NgbOffcanvasModule,
        OverlayModule,
        NzTableModule,
        // NzTreeModule,
        NzTreeSelectModule,
        AppSharedModule,
        AppCommonModule,
        OrganizeUnitRoutingModule,
    ]
})
export class OrganizeUnitModule { }
