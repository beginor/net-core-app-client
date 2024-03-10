import { Component } from '@angular/core';

import { AccountService } from 'app-shared';
import { NavigationService, UiService } from 'projects/web/src/app/common';

@Component({
    selector: 'app-admin-dashboard',
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
