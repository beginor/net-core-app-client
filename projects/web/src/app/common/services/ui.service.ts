import { Injectable } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    constructor(
        private nzModal: NzModalService,
        private nzMessage: NzMessageService,
    ) { }

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
}

export interface Alert {
    type: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary'
        | 'light' | 'dark';
    message: string;
}
