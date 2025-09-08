import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AccountService } from 'app-shared';
import { UiService } from '../services/ui.service';

import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NzBreadCrumbModule,
        NzButtonComponent,
        NzDropDownModule,
        NzIconModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {

    protected account = inject(AccountService);
    protected ui = inject(UiService);
    protected nav = inject(NavigationService);

    protected async logout(): Promise<void> {
        await this.account.logout();
    }


}
