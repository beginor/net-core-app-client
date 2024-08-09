import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService, EchartComponent } from 'app-shared';

import {
    NavigationService, UiService, NavCardComponent,
    AntdModule,
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
export class DashboardComponent implements OnInit {

    constructor(
        public account: AccountService,
        private ui: UiService,
        public navigation: NavigationService
    ) { }

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/'},
            { label: '管理' }
        ]);
    }

}
