import { Component, OnDestroy } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { RolesService, AppRoleModel } from '../roles.service';
import { DetailComponent } from '../detail/detail.component';
import { PrivilegeComponent } from '../privilege/privilege.component';

@Component({
    selector: 'app-role-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnDestroy {

    constructor(
        private drawerService: NzDrawerService,
        public account: AccountService,
        public ui: UiService,
        public vm: RolesService
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin' },
            { label: '角色管理' }
        ];
    }

    public ngOnDestroy(): void {
        this.vm.cleanUp();
    }

    public async loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): Promise<void> {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        await this.vm.search();
    }

    public showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<
            DetailComponent,
            Partial<DetailComponent>,
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

    public showPrivileges(role: AppRoleModel): void {
        const ref = this.drawerService.create<
            PrivilegeComponent,
            Partial<PrivilegeComponent>,
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

    public async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

}
