import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';

import { AntdModule } from '../antd.module';

import { AppCommonModule } from '../common';
import { AccountRoutingModule } from './account-routing.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { TokenListComponent } from './token-list/token-list.component';
import { TokenDetailComponent } from './token-detail/token-detail.component';

@NgModule({
    declarations: [
        UserInfoComponent,
        TokenListComponent,
        TokenDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AntdModule,
        AppCommonModule,
        AppSharedModule,
        AccountRoutingModule
    ]
})
export default class AccountModule { }
