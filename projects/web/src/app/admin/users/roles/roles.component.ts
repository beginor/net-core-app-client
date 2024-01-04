import { Component, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-roles',
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {

    public userId = '';
    public fullname = '';
    public get title(): string {
        return `设置 ${this.fullname || '用户'} 的角色`;
    }
    public editable = true;

    private userRoles: { [key: string]: boolean } = {};

    constructor(
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: UsersService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.vm.getRoles();
        const roles = await this.vm.getUserRoles(this.userId);
        for (const role of roles) {
            this.userRoles[role] = true;
        }
    }

    public cancel(): void {
        this.drawerRef.close('');
    }

    public async save(): Promise<void> {
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

    public isChecked(roleName: string): boolean {
        return this.userRoles[roleName];
    }

    public toggleUserRole(checked: boolean, roleName: string): void {
        this.userRoles[roleName] = checked;
    }

}
