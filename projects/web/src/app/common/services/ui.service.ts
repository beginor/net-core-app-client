import { Injectable } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeType } from '../nav-sidebar-antd/nav-sidebar-antd.component';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    constructor(
        private nzModal: NzModalService,
        private nzMessage: NzMessageService,
    ) { }

    public siderCollapsed = false;
    public siderTheme: ThemeType = 'dark';
    public showSider = true;
    public showHeader = true;
    public breadcrumbs: Breadcrumb[] = [];

    public showAlert(alert: Alert): void {
        const option = {
            nzDuration: 3000,
            nzAnimate: true,
            nzPauseOnHover: true
        };
        switch (alert.type) {
            case 'info':
                this.nzMessage.info(alert.message, option);
                break;
            case 'success':
                this.nzMessage.success(alert.message, option);
                break;
            case 'warning':
                this.nzMessage.warning(alert.message, option);
                break;
            case 'danger':
                this.nzMessage.error(alert.message, option);
                break;
            default:
                this.nzMessage.create(alert.type, alert.message, option);
                break;
        }
    }

    public showConfirm(message: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.nzModal.confirm({
                nzTitle: '提示：',
                nzContent: message,
                nzOnOk: () => resolve(true),
                nzOnCancel: () => resolve(false),
            });
        });
    }

    public toggleSider(): void {
        this.siderCollapsed = !this.siderCollapsed;
    }
}

export interface Alert {
    type: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary'
        | 'light' | 'dark';
    message: string;
}

export interface Breadcrumb {
    label: string;
    url?: string;
}
