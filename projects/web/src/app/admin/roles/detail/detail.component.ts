import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { RolesService, AppRoleModel } from '../roles.service';

@Component({
    selector: 'app-role-detail',
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
    public editable = true;

    protected get title(): string {
        let title: string;
        if (this.id === '0') {
            title = '新建角色';
        }
        else if (this.editable) {
            title = '编辑角色';
        }
        else {
            title = '查看角色';
        }
        return title;
    }

    protected model: AppRoleModel = { id: '0', name: '' };

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(RolesService);

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
        this.drawerRef.close('ok')
    }

}
