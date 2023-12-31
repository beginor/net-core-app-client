import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { AntdModule } from '../../antd.module';
import { AppCommonModule } from '../../common';

import { RolesRoutingModule } from './roles-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { PrivilegeComponent } from './privilege/privilege.component';

@NgModule({
    declarations: [
        ListComponent,
        DetailComponent,
        PrivilegeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        AppSharedModule,
        AppCommonModule,
        RolesRoutingModule
    ]
})
export class RolesModule { }
