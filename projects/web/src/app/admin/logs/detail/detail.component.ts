import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { AppLogService, AppLogModel } from '../logs.service';

@Component({
    selector: 'app-log-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public id = '';
    public editable = false;

    protected get title(): string {
        let title = '';
        if (this.id === '0') {
            title = '新建应用程序日志';
        }
        else if (this.editable) {
            title = '编辑应用程序日志';
        }
        else {
            title = '查看应用程序日志';
        }
        return title;
    }

    protected model: AppLogModel = { id: '' };

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(AppLogService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (model) {
                this.model = model;
            }
        }
    }

    protected cancel(): void {
        this.drawerRef.close('');
    }

}
