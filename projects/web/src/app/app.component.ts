import { Component, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountService } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import {
    NavSidebarAntdComponent
} from './common/nav-sidebar-antd/nav-sidebar-antd.component';
import { HeaderComponent } from './common/header/header.component';
import { UiService } from './common/services/ui.service';
import { NavigationService } from './common/services/navigation.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        AntdModule,
        NavSidebarAntdComponent,
        RouterModule,
        HeaderComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {

    constructor(
        public account: AccountService,
        public ui: UiService,
        public navigation: NavigationService,
        errorHandler: ErrorHandler,
    ) {
        account.getInfo().catch(ex => {
            errorHandler.handleError(ex);
        });
    }

}
