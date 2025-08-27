import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

import {
    NavigationService
} from '../services/navigation.service';

@Component({
    selector: 'app-nav-sidebar-antd',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AntdModule,
        SvgIconComponent,
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

}
