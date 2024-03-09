import { Component, ErrorHandler } from '@angular/core';

import { AccountService } from 'app-shared';
import { UiService } from './common/services/ui.service';
import { NavigationService } from './common/services/navigation.service';
import { ThemeType } from './common/';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: []
})
export class AppComponent {

    public collapsed = false;
    public theme: ThemeType = 'dark';

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
