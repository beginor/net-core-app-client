import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { NgbModule } from '../../ngb.module';
import { AppCommonModule } from '../../common';

import { AuditLogsRoutingModule } from './audit-logs-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [ListComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        AppSharedModule,
        AppCommonModule,
        AuditLogsRoutingModule
    ]
})
export class AuditLogsModule { }
