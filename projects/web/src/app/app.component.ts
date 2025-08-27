import { Component, effect, inject } from '@angular/core';
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
export class AppComponent {

    private currentUserId = '';
    private currentUrl = '';
    private loginUrl = '/login';

    protected ui = inject(UiService);
    private account = inject(AccountService);
    private router = inject(Router);

    constructor() {
        this.router.events.pipe(
            first(e => e.type === EventType.NavigationError)
        ).subscribe(e => {
            void this.router.navigate([this.loginUrl, { returnUrl: e.url }]);
        });
        this.router.events.pipe(
            filter(e => e.type == EventType.NavigationEnd)
        ).subscribe(e => {
            this.currentUrl = e.url;
        });
        effect(() => {
            const user = this.account.current();
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
