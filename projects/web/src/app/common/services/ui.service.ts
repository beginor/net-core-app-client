import { inject, Injectable, signal } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    private nzModal = inject(NzModalService);
    private nzMessage = inject(NzMessageService);

    public siderCollapsed = signal(true);
    public siderTheme = signal<ThemeType>('dark');
    public showSider = signal(true);
    public showHeader = signal(true);
    public breadcrumbs = signal<Breadcrumb[]>([]);
    public showLoginForm = signal(true);

    public showAlert(alert: Alert): void {
        const option = {
            nzDuration: 3000,
            nzAnimate: true,
            nzPauseOnHover: true,
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
        return new Promise<boolean>(resolve => {
            this.nzModal.confirm({
                nzTitle: '提示：',
                nzContent: message,
                nzOnOk: () => {
                    resolve(true);
                },
                nzOnCancel: () => {
                    resolve(false);
                }
            });
        });
    }

    public toggleSider(): void {
        this.siderCollapsed.update(collapsed => !collapsed);
    }

    public toNzIconType(icon: string): string {
        if (icon.includes(':')) {
            return icon;
        }
        const idx = icon.indexOf('/');
        if (idx > 0) {
            return icon.substring(0, idx) + ':' + icon.substring(idx + 1);
        }
        return icon;
    }

}

export interface Alert {
    type: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'light' | 'dark';
    message: string;
}

export interface Breadcrumb {
    label: string;
    url?: string;
}

export type ThemeType = 'dark' | 'light';
