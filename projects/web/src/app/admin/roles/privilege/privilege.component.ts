import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { RolesService } from '../roles.service';

@Component({
    selector: 'app-role-privilege',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
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
