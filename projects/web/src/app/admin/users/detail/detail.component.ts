import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { UserModel, UsersService } from '../users.service';
import {
    OrganizeUnitService
} from '../../organize-units/organize-units.service';

@Component({
    selector: 'app-users-detail',
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

    protected get title(): string {
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

    protected model: UserModel = {
        id: '0',
        lockoutEnabled: true, gender: '保密',
        organizeUnit: { id: '', name: '' }
    };
    protected dateOfBirthDate: Date = new Date('1970-01-01');

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);
    protected organizeUnitSvc = inject(OrganizeUnitService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (model) {
                this.model = model;
            }
            if (this.model.dateOfBirth) {
                this.dateOfBirthDate = new Date(this.model.dateOfBirth);
            }
        }
        // this.initOrganizeUnit();
    }

    protected initOrganizeUnit(): void {
        void this.organizeUnitSvc.search();
        this.organizeUnitSvc.subscribeDataToTreeNodes();
    }

    protected cancel(): void {
        this.drawerRef.close('');
    }

    protected async save(): Promise<void> {
        const d = this.dateOfBirthDate;
        this.model.dateOfBirth = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.drawerRef.close('ok');
    }

    protected onOrganizeUnitClick(event: NzFormatEmitEvent)
        : void {
        if (event.node) {
            this.model.organizeUnit = {
                id: event.node.key,
                name: event.node.title,
            }
        }
    }
}
