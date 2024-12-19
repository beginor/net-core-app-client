import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, EventType } from '@angular/router';
import { first, filter } from 'rxjs';

import { AccountService } from 'app-shared';
import {
    AntdModule, NavSidebarAntdComponent, HeaderComponent, UiService,
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
export class AppComponent implements OnInit {

    private currentUserId = '';
    private currentUrl = '';
    private loginUrl = '/login';

    constructor(
        protected ui: UiService,
        private account: AccountService,
        private router: Router,
    ) {
        router.events.pipe(
            first(e => e.type === EventType.NavigationError)
        ).subscribe(e => {
            void router.navigate([this.loginUrl, { returnUrl: e.url }]);
        });
        router.events.pipe(
            filter(e => e.type == EventType.NavigationEnd)
        ).subscribe(e => {
            this.currentUrl = e.url;
        });
    }

    public ngOnInit(): void {
        this.account.info.subscribe(user => {
            if (this.currentUserId && !user.id) {
                void this.router.navigate([
                    '/login',
                    { returnUrl: this.currentUrl }
                ]);
            }
            else {
                this.currentUserId = user.id;
            }
        });
    }

}
