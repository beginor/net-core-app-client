import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AccountService } from 'app-shared';
import {
    StorageBrowserComponent, StorageContent
} from 'projects/web/src/app/common';
import {
    NavItemsService, NavItemModel, MenuOption
} from '../nav-items.service';

@Component({
    selector: 'app-nav-item-detail',
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
        NzInputNumberModule,
        NzSpaceModule,
        NzSelectModule,
        NzToolTipModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    private modal = inject(NzModalService);
    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(NavItemsService);
    protected params = inject<DetailParams>(NZ_DRAWER_DATA);

    protected get title(): string {
        if (this.params.id === '0') {
            return '新建菜单项';
        }
        else if (this.params.editable) {
            return '编辑菜单项';
        }
        else {
            return '查看菜单项';
        }
    }

    protected targets = [
        { name: '当前窗口', value: '' },
        { name: '内嵌窗口', value: '_iframe' }
    ];
    protected model: NavItemModel = { id: '0', target: '', roles: [], sequence: 0 };

    protected parents: MenuOption[] = [];

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getAllRoles();
        this.parents = await this.vm.getMenuOptions();
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

    protected showIconDialog(): void {
        const modalRef = this.modal.create<
            StorageBrowserComponent,
            StorageContent,
            string
        >({
            nzClosable: false,
            nzWidth: '1056px',
            nzBodyStyle: { padding: '0' },
            nzContent: StorageBrowserComponent,
            nzTitle: undefined,
            nzFooter: null,
            nzData: {
                title: '选择图标',
                alias: 'icons',
                path: '/',
                filter: '*.svg'
            }
        });
        modalRef.afterClose.subscribe(result => {
            if (!result) {
                return;
            }
            let icon = result;
            if (icon.endsWith('.svg')) {
                icon = icon.substring(0, icon.length - 4);
                this.model.icon = icon;
            }
        });
    }

}

export interface DetailParams {
    id: string;
    editable: boolean;
}
