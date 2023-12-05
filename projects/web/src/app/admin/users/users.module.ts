import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppSharedModule } from 'app-shared';
import { NgbModule } from '../../ngb.module';
import { AppCommonModule } from '../../common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { PasswordComponent } from './password/password.component';
import { LockComponent } from './lock/lock.component';
import { RolesComponent } from './roles/roles.component';

@NgModule({
  declarations: [
      ListComponent,
      DetailComponent,
      PasswordComponent,
      LockComponent,
      RolesComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppCommonModule,
    AppSharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
