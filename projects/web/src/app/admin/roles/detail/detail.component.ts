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

import { RolesService, AppRoleModel } from '../roles.service';

@Component({
    selector: 'app-role-detail',
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
    protected vm = inject(RolesService);
    protected params = inject<DetailParams>(NZ_DRAWER_DATA);

    protected get title(): string {
        let title: string;
        if (this.params.id === '0') {
            title = '新建角色';
        }
        else if (this.params.editable) {
            title = '编辑角色';
        }
        else {
            title = '查看角色';
        }
        return title;
    }

    protected model: AppRoleModel = { id: '0', name: '' };

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
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

}

export interface DetailParams {
    id: string;
    editable: boolean;
}
