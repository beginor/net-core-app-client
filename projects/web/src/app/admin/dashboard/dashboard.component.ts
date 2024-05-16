import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService, EchartComponent } from 'app-shared';

import { AntdModule } from 'projects/web/src/app/antd.module';
import {
    NavigationService, UiService, NavCardComponent,
} from 'projects/web/src/app/common';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        EchartComponent,
        AntdModule,
        NavCardComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

    constructor(
        public account: AccountService,
        public ui: UiService,
        public navigation: NavigationService
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/'},
            { label: '管理' }
        ];
    }

}
