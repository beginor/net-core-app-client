import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { NgbModule } from '../../ngb.module';
import { AppCommonModule } from '../../common';

import { PrivilegesRoutingModule } from './privileges-routing.module';
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
        NgbModule,
        AppSharedModule,
        AppCommonModule,
        PrivilegesRoutingModule
    ]
})
export class PrivilegesModule { }
