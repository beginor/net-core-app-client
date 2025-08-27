import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import {
    AppStorageService, AppStorageModel
} from '../storages.service';

@Component({
    selector: 'app-storage-detail',
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
    public editable = false;

    protected get title(): string {
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
    protected model: AppStorageModel = { id: '0', aliasName: '', rootFolder: '', readonly: true, roles: [] };

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(AppStorageService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getAllRoles();
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

    protected async save(): Promise<void> {
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

    protected isRoleChecked(role: string): boolean {
        if (!this.model.roles) {
            return false;
        }
        return this.model.roles.includes(role);
    }

    protected toggleCheckedRole(role: string): void {
        this.model.roles ??= [];
        const idx = this.model.roles.indexOf(role);
        if (idx > -1) {
            this.model.roles.splice(idx, 1);
        }
        else {
            this.model.roles.push(role);
        }
    }

}
