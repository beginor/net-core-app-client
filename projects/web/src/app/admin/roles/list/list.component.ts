import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { RolesService, AppRoleModel } from '../roles.service';
import { DetailComponent, DetailParams } from '../detail/detail.component';
import { PrivilegeComponent, PrivilegeParams } from '../privilege/privilege.component';

@Component({
    selector: 'app-role-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzButtonModule,
        NzCardModule,
        NzDrawerModule,
        NzFormModule,
        NzIconModule,
        NzSelectModule,
        NzSpaceModule,
        NzTableModule,
        NzTooltipModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {

    private drawerService = inject(NzDrawerService);
    private ui = inject(UiService);
    protected account = inject(AccountService);
    protected vm = inject(RolesService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin/dashboard' },
            { label: '角色管理' }
        ]);
    }

    public ngOnDestroy(): void {
        this.vm.cleanUp();
    }

    protected async loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): Promise<void> {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        await this.vm.search();
    }

    protected showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<
            DetailComponent,
            DetailParams,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: DetailComponent,
            nzBodyStyle: { padding: '0' },
            nzData: { id, editable },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    protected showPrivileges(role: AppRoleModel): void {
        const ref = this.drawerService.create<
            PrivilegeComponent,
            PrivilegeParams,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: PrivilegeComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                id: role.id,
                title: `${role.description}权限列表`
            },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    protected async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

}
