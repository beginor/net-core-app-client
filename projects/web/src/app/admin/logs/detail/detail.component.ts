﻿import { Component, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

import { AppLogService, AppLogModel } from '../logs.service';

@Component({
    selector: 'app-log-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public id = '';
    public get title(): string {
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
    public editable = false;

    public model: AppLogModel = { id: '' };

    constructor(
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: AppLogService
    ) { }

    public async ngOnInit(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (!!model) {
                this.model = model;
            }
        }
    }

    public cancel(): void {
        this.drawerRef.close('');
    }

}
