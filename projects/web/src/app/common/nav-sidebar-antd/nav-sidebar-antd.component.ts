import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { UiService } from '../services/ui.service';

import {
    NavigationService
} from '../services/navigation.service';

@Component({
    selector: 'app-nav-sidebar-antd',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NzMenuModule,
        NzIconModule,
        NzTooltipModule,
    ],
    templateUrl: './nav-sidebar-antd.component.html',
    styleUrl: './nav-sidebar-antd.component.css'
})
export class NavSidebarAntdComponent {

    protected router = inject(Router);
    protected vm = inject(NavigationService);
    protected ui = inject(UiService);

    protected async goTo(url: string): Promise<void> {
        await this.router.navigateByUrl(url);
    }

    protected toIconType(iconPath: string): string {
        if (!iconPath) {
            return 'bi:question-circle';
        }
        return this.ui.toNzIconType(iconPath);
    }

}
