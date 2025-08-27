import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ThemeType } from '../nav-sidebar-antd/nav-sidebar-antd.component';

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

    public showConfirm(message: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.nzModal.confirm({
                nzTitle: '提示：',
                nzContent: message,
                nzOnOk: () => {
                    observer.next(true);
                    observer.complete();
                },
                nzOnCancel: () => {
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }

    public toggleSider(): void {
        this.siderCollapsed.update(collapsed => !collapsed);
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
