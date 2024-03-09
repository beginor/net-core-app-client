import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppSharedModule } from 'app-shared';
import { AntdModule } from '../antd.module';

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
        AntdModule,
        AppSharedModule,
    ],
    exports: [
        NavSidebarAntdComponent,
        IframeComponent,
        NavCardComponent,
        AttachmentUploadComponent,
    ],
})
export class AppCommonModule { }
