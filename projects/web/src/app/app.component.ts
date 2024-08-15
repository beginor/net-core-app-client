import { Component, ErrorHandler } from '@angular/core';
import { Router, RouterModule, EventType } from '@angular/router';
import { first, filter } from 'rxjs';

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
        protected account: AccountService,
        protected ui: UiService,
        protected navigation: NavigationService,
        errorHandler: ErrorHandler,
        router: Router,
    ) {
        const login = '/login'
        let currentUrl = '';
        router.events.pipe(
            first(e => e.type === EventType.NavigationError)
        ).subscribe(e => {
            void router.navigate([login, { returnUrl: e.url }]);
        });
        router.events.pipe(
            filter(e => e.type == EventType.NavigationEnd)
        ).subscribe(e => {
            currentUrl = e.url;
        });
        account.getInfo().then(() => {
            account.info.subscribe(user => {
                if (!user.id && !currentUrl.startsWith(login)) {
                    void router.navigate([login, { returnUrl: currentUrl }]);
                }
            })
        }).catch(ex => {
            errorHandler.handleError(ex);
        });
    }

}
