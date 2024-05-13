import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AccountService } from 'app-shared';

import { UiService } from '../services/ui.service';
import { NavMenuService } from './nav-menu.service';
import { MatModule } from '../mat/mat.module';

@Component({
    selector: 'app-nav-menu',
    standalone: true,
    imports: [
        CommonModule, RouterModule,
        MatModule,
    ],
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {

    constructor(
        private router: Router,
        private ui: UiService,
        public vm: NavMenuService,
        public accountSvc: AccountService
    ) { }

    public toggleDrawer(): void {
        this.ui.drawer.subscribe(drawer => {
            drawer.close();
        });
    }

    public async logout(): Promise<void> {
        await this.accountSvc.logout();
        this.toggleDrawer();
        await this.router.navigate(['/login'], { replaceUrl: true });
    }

}
