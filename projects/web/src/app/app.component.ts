import { Component, ErrorHandler } from '@angular/core';

import { AccountService } from 'app-shared';
import { UiService } from './common/services/ui.service';
import { NavigationService } from './common/services/navigation.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: []
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
