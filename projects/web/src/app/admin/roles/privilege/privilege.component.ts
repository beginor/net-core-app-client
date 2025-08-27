import { Component, inject, OnInit } from '@angular/core';
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

    private drawerRef = inject(NzDrawerRef);
    protected vm = inject(RolesService);

    public ngOnInit(): void {
        void this.loadData();
    }

    private async loadData(): Promise<void> {
        await this.vm.getPrivilegesForRole(this.id);
        await this.vm.getAllPrivileges();
    }

    protected close(): void {
        this.drawerRef.close('');
    }

    protected async togglePrivilege(name: string): Promise<void> {
        await this.vm.toggleRolePrivilege(this.id, name);
    }

}
