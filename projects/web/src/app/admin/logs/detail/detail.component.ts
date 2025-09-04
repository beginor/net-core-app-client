import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

import { AppLogService, AppLogModel } from '../logs.service';

@Component({
    selector: 'app-log-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzCardModule,
        NzFormModule,
        NzIconModule,
        NzSpaceModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(AppLogService);
    protected params = inject<DetailParams>(NZ_DRAWER_DATA);

    protected get title(): string {
        let title = '';
        if (this.params.id === '0') {
            title = '新建应用程序日志';
        }
        else if (this.params.editable) {
            title = '编辑应用程序日志';
        }
        else {
            title = '查看应用程序日志';
        }
        return title;
    }

    protected model: AppLogModel = { id: '' };

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        if (this.params.id !== '0') {
            const model = await this.vm.getById(this.params.id);
            if (model) {
                this.model = model;
            }
        }
    }

    protected cancel(): void {
        this.drawerRef.close('');
    }

}

export interface DetailParams {
    id: string;
    editable: boolean;
}
