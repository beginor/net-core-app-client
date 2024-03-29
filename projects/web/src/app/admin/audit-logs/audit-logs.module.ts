import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { AntdModule } from '../../antd.module';
import { AppCommonModule } from '../../common';

import { AuditLogsRoutingModule } from './audit-logs-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [ListComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AntdModule,
        AppSharedModule,
        AppCommonModule,
        AuditLogsRoutingModule
    ]
})
export class AuditLogsModule { }
