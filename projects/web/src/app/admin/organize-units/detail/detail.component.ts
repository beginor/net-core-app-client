import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/antd.module';

import {
    OrganizeUnitService,
    AppOrganizeUnitModel
} from '../organize-units.service';

@Component({
    selector: 'app-organize-unit-detail',
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
            title = '新建组织单元';
        }
        else if (this.editable) {
            title = '编辑组织单元';
        }
        else {
            title = '查看组织单元';
        }
        return title;
    }

    public editable = false;
    public model: AppOrganizeUnitModel = {
        id: '0', name: '', sequence: 0
    };

    constructor(
        private drawerRef: NzDrawerRef<{ id: string, editable: boolean }>,
        public account: AccountService,
        public vm: OrganizeUnitService
    ) { }

    public async ngOnInit(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (!!model) {
                this.model = model;
            }
        }
        this.vm.subscribeDataToTreeNodes(this.model.id);
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
