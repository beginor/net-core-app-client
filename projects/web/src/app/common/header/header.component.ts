import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {

    constructor(
        public account: AccountService,
        public ui: UiService,
        public nav: NavigationService,
        private router: Router
    ) { }

    public async logout(): Promise<void> {
        await this.account.logout();
    }


}
