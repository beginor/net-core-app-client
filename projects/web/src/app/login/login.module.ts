import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { AntdModule } from '../antd.module';
import { AppCommonModule } from '../common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        AppCommonModule,
        AppSharedModule,
        LoginRoutingModule
    ]
})
export default class LoginModule { }
