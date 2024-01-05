import { Component, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { RolesService } from '../roles.service';

@Component({
    selector: 'app-role-privilege',
    templateUrl: './privilege.component.html',
    styleUrl: './privilege.component.css',
})
export class PrivilegeComponent implements OnInit {

    public title = '';
    public id = '0';

    constructor(
        private drawerRef: NzDrawerRef,
        public vm: RolesService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.vm.getPrivilegesForRole(this.id);
        await this.vm.getAllPrivileges();
    }

    public close(): void {
        this.drawerRef.close('');
    }

    public async togglePrivilege(name: string): Promise<void> {
        await this.vm.toggleRolePrivilege(this.id, name);
    }

}
