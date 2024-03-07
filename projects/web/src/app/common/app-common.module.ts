import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppSharedModule } from 'app-shared';
import { NgbModule } from '../ngb.module';
import { AntdModule } from '../antd.module';

import { NavTopBarComponent } from './nav-topbar/nav-topbar.component';
import { NavSidebarComponent } from './nav-sidebar/nav-sidebar.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import {
    NavSidebarAntdComponent
} from './nav-sidebar-antd/nav-sidebar-antd.component';
import { IframeComponent } from './iframe/iframe.component';
import {
    StorageBrowserComponent
} from './storage-browser/storage-browser.component';
import { NavCardComponent } from './nav-card/nav-card.component';
import {
    AttachmentUploadComponent
} from './attachment-upload/attachment-upload.component';
@NgModule({
    declarations: [
        NavTopBarComponent,
        NavSidebarComponent,
        NavItemComponent,
        NavSidebarAntdComponent,
        IframeComponent,
        StorageBrowserComponent,
        NavCardComponent,
        AttachmentUploadComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        LayoutModule,
        ScrollingModule,
        NgbModule,
        AntdModule,
        AppSharedModule,
    ],
    exports: [
        NavTopBarComponent,
        NavSidebarComponent,
        NavSidebarAntdComponent,
        IframeComponent,
        NavCardComponent,
        AttachmentUploadComponent,
    ],
})
export class AppCommonModule { }
