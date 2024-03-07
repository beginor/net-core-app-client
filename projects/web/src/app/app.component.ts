import { Component, ErrorHandler } from '@angular/core';

import {
    NgbTooltipConfig,
    NgbDropdownConfig,
    NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';

import { AccountService } from 'app-shared';
import { UiService } from './common/services/ui.service';
import { NavigationService } from './common/services/navigation.service';
import { ThemeType } from './common/';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [
        NgbTooltipConfig,
        NgbDropdownConfig
    ]
})
export class AppComponent {

    public collapsed = false;
    public theme: ThemeType = 'dark';

    constructor(
        account: AccountService,
        public ui: UiService,
        public navigation: NavigationService,
        errorHandler: ErrorHandler,
        tooltip: NgbTooltipConfig,
        dropdown: NgbDropdownConfig,
        modal: NgbModalConfig
    ) {
        tooltip.container = 'body';
        dropdown.container = 'body';
        modal.container = 'body';
        account.getInfo().catch(ex => {
            errorHandler.handleError(ex);
        });
    }

}
