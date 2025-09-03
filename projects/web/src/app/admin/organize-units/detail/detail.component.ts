import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

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
        NzButtonModule,
        NzCardModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzInputNumberModule,
        NzSpaceModule,
        NzSelectModule,
        NzTreeSelectModule,
        NzToolTipModule,
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    protected id = '0';
    protected get title(): string {
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

    protected editable = false;
    protected model: AppOrganizeUnitModel = {
        id: '0', name: '', sequence: 0
    };

    private drawerRef = inject(NzDrawerRef<{ id: string, editable: boolean }>)
    protected account = inject(AccountService);
    protected vm = inject(OrganizeUnitService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (model) {
                this.model = model;
            }
        }
        this.vm.subscribeDataToTreeNodes(this.model.id);
    }

    protected cancel(): void {
        this.drawerRef.close('');
    }

    protected async save(): Promise<void> {
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.drawerRef.close('ok');
    }
}
