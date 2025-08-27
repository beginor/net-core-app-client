import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-roles',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {

    public userId = '';
    public editable = true;
    public fullname = '';

    protected get title(): string {
        return `设置 ${this.fullname || '用户'} 的角色`;
    }

    private userRoles: Record<string, boolean> = {};

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getRoles();
        const roles = await this.vm.getUserRoles(this.userId);
        for (const role of roles) {
            this.userRoles[role] = true;
        }
    }

    protected cancel(): void {
        this.drawerRef.close('');
    }

    protected async save(): Promise<void> {
        const toDelete = [];
        const toAdd = [];
        for (const role in this.userRoles) {
            if (this.userRoles.hasOwnProperty(role)) {
                const isAdd = this.userRoles[role];
                if (isAdd) {
                    toAdd.push(role);
                }
                else {
                    toDelete.push(role);
                }
            }
        }
        await this.vm.saveUserRoles(this.userId, toAdd, toDelete);
        this.drawerRef.close('ok');
    }

    protected isChecked(roleName: string): boolean {
        return this.userRoles[roleName];
    }

    protected toggleUserRole(checked: boolean, roleName: string): void {
        this.userRoles[roleName] = checked;
    }

}
