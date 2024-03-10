import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import {
    NavigationService} from '../services/navigation.service';

@Component({
  selector: 'app-nav-sidebar-antd',
  standalone: false,
  templateUrl: './nav-sidebar-antd.component.html',
  styleUrl: './nav-sidebar-antd.component.css'
})
export class NavSidebarAntdComponent {

    private isCollapsed = true;
    @Input()
    public get collapsed(): boolean { return this.isCollapsed; }
    public set collapsed(value: boolean) {
        this.isCollapsed = value;
    }

    @Input()
    public theme: ThemeType = 'dark';

    constructor(
        public router: Router,
        public vm: NavigationService
    ) { }

    public async goTo(url: string): Promise<void> {
        await this.router.navigateByUrl(url);
    }

}

export type ThemeType = 'dark' | 'light';
