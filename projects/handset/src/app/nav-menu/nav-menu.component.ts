import { Component, inject } from '@angular/core';
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

    private router = inject(Router);
    private ui = inject(UiService);
    protected vm = inject(NavMenuService);
    protected account = inject(AccountService);

    protected toggleDrawer(): void {
        this.ui.drawer.subscribe(drawer => {
            void drawer.close();
        });
    }

    protected async logout(): Promise<void> {
        await this.account.logout();
        this.toggleDrawer();
        await this.router.navigate(['/login'], { replaceUrl: true });
    }

}
