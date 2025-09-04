import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-roles',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzCardModule,
        NzCheckboxModule,
        NzFormModule,
        NzIconModule,
        NzSpaceModule,
    ],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);
    protected params = inject<RolesParams>(NZ_DRAWER_DATA);

    protected get title(): string {
        return `设置 ${this.params.fullname || '用户'} 的角色`;
    }

    private userRoles: Record<string, boolean> = {};

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getRoles();
        const roles = await this.vm.getUserRoles(this.params.id);
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
        await this.vm.saveUserRoles(this.params.id, toAdd, toDelete);
        this.drawerRef.close('ok');
    }

    protected isChecked(roleName: string): boolean {
        return this.userRoles[roleName];
    }

    protected toggleUserRole(checked: boolean, roleName: string): void {
        this.userRoles[roleName] = checked;
    }

}

export interface RolesParams {
    id: string;
    editable: boolean;
    fullname: string;
}
