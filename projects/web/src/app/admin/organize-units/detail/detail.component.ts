import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

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
