import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { AccountService } from 'app-shared';

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
        NzButtonModule,
        NzCardModule,
        NzCheckboxModule,
        NzDatePickerModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzRadioModule,
        NzSpaceModule,
        NzTreeSelectModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);
    protected organizeUnitSvc = inject(OrganizeUnitService);
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

    protected model: UserModel = {
        id: '0',
        lockoutEnabled: true, gender: '保密',
        organizeUnit: { id: '', name: '' }
    };
    protected dateOfBirthDate: Date = new Date('1970-01-01');

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        if (this.params.id !== '0') {
            const model = await this.vm.getById(this.params.id);
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
        if (this.params.id !== '0') {
            await this.vm.update(this.params.id, this.model);
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

export interface DetailParams {
    id: string;
    editable: boolean;
}
