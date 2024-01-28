import { Component, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

import {
    AppStorageService, AppStorageModel
} from '../storages.service';

@Component({
    selector: 'app-storage-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public id = '0';
    public get title(): string {
        let title: string;
        if (this.id === '0') {
            title = '新建存储目录';
        }
        else if (this.editable) {
            title = '编辑存储目录';
        }
        else {
            title = '查看存储目录';
        }
        return title;
    }
    public editable = false;
    public model: AppStorageModel = { id: '0', aliasName: '', rootFolder: '', readonly: true, roles: [] }; // eslint-disable-line max-len

    constructor(
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: AppStorageService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.vm.getAllRoles();
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
        if (this.model.roles?.length === 0) {
            delete this.model.roles;
        }
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.drawerRef.close('ok');
    }

    public isRoleChecked(role: string): boolean {
        if (!this.model.roles) {
            return false;
        }
        return this.model.roles.indexOf(role) > -1;
    }

    public toggleCheckedRole(role: string): void {
        if (!this.model.roles) {
            this.model.roles = [];
        }
        const idx = this.model.roles.indexOf(role);
        if (idx > -1) {
            this.model.roles.splice(idx, 1);
        }
        else {
            this.model.roles.push(role);
        }
    }

}
