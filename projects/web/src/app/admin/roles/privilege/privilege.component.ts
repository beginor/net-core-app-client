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

import { RolesService } from '../roles.service';

@Component({
    selector: 'app-role-privilege',
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
    templateUrl: './privilege.component.html',
    styleUrl: './privilege.component.css',
})
export class PrivilegeComponent implements OnInit {

    protected params = inject<PrivilegeParams>(NZ_DRAWER_DATA);

    private drawerRef = inject(NzDrawerRef);
    protected vm = inject(RolesService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getPrivilegesForRole(this.params.id);
        await this.vm.getAllPrivileges();
    }

    protected close(): void {
        this.drawerRef.close('');
    }

    protected async togglePrivilege(name: string): Promise<void> {
        await this.vm.toggleRolePrivilege(this.params.id, name);
    }

}

export interface PrivilegeParams {
    id: string;
    title: string;
}
