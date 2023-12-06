import { Component, OnInit } from '@angular/core';

import { AccountService } from 'app-shared';
import {
    OrganizeUnitService,
    AppOrganizeUnitModel
} from '../organize-units.service';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
    selector: 'app-organize-unit-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public id = '';
    public get title(): string {
        let title = '';
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
        id: '', name: '', sequence: 0
    };
    private reloadList = false;
    public treeNodes: NzTreeNodeOptions[] = [];

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
        this.vm.data.subscribe((data) => {
            this.treeNodes = this.vm.convertToNzTreeNodeOptions(data
                , this.model.id);
        });
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
