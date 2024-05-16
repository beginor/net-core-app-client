import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AccountService, SvgIconComponent } from 'app-shared';
import {
    AntdModule, StorageBrowserComponent, StorageContent
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
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public editable = false;
    public id = '0';

    public get title(): string {
        if (this.id === '0') {
            return '新建菜单项';
        }
        else if (this.editable) {
            return '编辑菜单项';
        }
        else {
            return '查看菜单项';
        }
    }

    public targets = [
        { name: '当前窗口', value: '' },
        { name: '内嵌窗口', value: '_iframe' }
    ];
    public model: NavItemModel = { id: '0', target: '', roles: [] };

    public parents: MenuOption[] = [];

    constructor(
        private modal: NzModalService,
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: NavItemsService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.vm.getAllRoles();
        this.parents = await this.vm.getMenuOptions();
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

    public showIconDialog(): void {
        const modalRef = this.modal.create<
            StorageBrowserComponent,
            StorageContent,
            string
        >({
            nzClosable: false,
            nzWidth: '824px',
            nzBodyStyle: { padding: '0' },
            nzContent: StorageBrowserComponent,
            nzTitle: undefined,
            nzFooter: null,
            nzData: {
                alias: 'icons',
                path: '/',
                filter: '*.svg'
            }
        });
        modalRef.afterClose.subscribe(result => {
            let icon = result!;
            if (icon.endsWith('.svg')) {
                icon = icon.substring(0, icon.length - 4);
                this.model.icon = icon;
            }
        });
    }

}
