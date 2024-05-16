import { Component, ErrorHandler } from '@angular/core';
import { NavigationError, Router, RouterModule } from '@angular/router';
import { first } from 'rxjs';

import { AccountService } from 'app-shared';
import {
    AntdModule, NavSidebarAntdComponent, HeaderComponent, UiService,
    NavigationService
 } from 'projects/web/src/app/common';

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
        router: Router,
    ) {
        router.events
            .pipe(first(e => e instanceof NavigationError))
            .subscribe((e) => {
                const ne = e as NavigationError;
                void router.navigate(['/login', { returnUrl: ne.url }]);
            })
        account.getInfo().catch(ex => {
            errorHandler.handleError(ex);
        });
    }

}
