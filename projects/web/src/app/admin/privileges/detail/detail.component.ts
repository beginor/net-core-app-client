import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { AppPrivilegeModel, AppPrivilegeService } from '../privileges.service';

@Component({
    selector: 'app-privilege-detail',
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

    public id = '0';
    public get title(): string {
        let title: string;
        if (this.id === '0') {
            title = '新建系统权限';
        }
        else if (this.editable) {
            title = '编辑系统权限';
        }
        else {
            title = '查看系统权限';
        }
        return title;
    }
    public editable = true;
    public model: AppPrivilegeModel = { id: '0', name: '' };

    constructor(
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: AppPrivilegeService
    ) { }

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
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

    public async save(): Promise<void> {
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.drawerRef.close('ok');
    }

}
