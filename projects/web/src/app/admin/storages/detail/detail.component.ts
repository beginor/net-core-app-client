import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

import {
    AppStorageService, AppStorageModel
} from '../storages.service';

@Component({
    selector: 'app-storage-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzCardModule,
        NzCheckboxModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzSpaceModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(AppStorageService);
    protected params = inject<DetailParams>(NZ_DRAWER_DATA);

    protected get title(): string {
        let title: string;
        if (this.params.id === '0') {
            title = '新建存储目录';
        }
        else if (this.params.editable) {
            title = '编辑存储目录';
        }
        else {
            title = '查看存储目录';
        }
        return title;
    }
    protected model: AppStorageModel = { id: '0', aliasName: '', rootFolder: '', readonly: true, roles: [] };

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getAllRoles();
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

    protected async save(): Promise<void> {
        if (this.model.roles?.length === 0) {
            delete this.model.roles;
        }
        if (this.params.id !== '0') {
            await this.vm.update(this.params.id, this.model);
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

export interface DetailParams {
    id: string;
    editable: boolean;
}
