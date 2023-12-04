import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NgbPaginationModule, NgbTooltipModule, NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AppSharedModule } from 'app-shared';
import { AppCommonModule } from 'projects/web/src/app/common';

import { OrganizeUnitRoutingModule } from './organize-units-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { NzTableModule } from 'ng-zorro-antd/table';
// import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

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
        AppSharedModule,
        AppCommonModule,
        OrganizeUnitRoutingModule,
        NzTableModule,
        // NzTreeModule,
        NzTreeSelectModule
    ]
})
export class OrganizeUnitModule { }
