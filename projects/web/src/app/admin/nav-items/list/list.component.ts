import { Component } from '@angular/core';

import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { NavItemsService } from '../nav-items.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
    selector: 'app-nav-item-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent {

    constructor(
        private drawerService: NzDrawerService,
        public ui: UiService,
        public account: AccountService,
        public vm: NavItemsService
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin' },
            { label: '导航菜单' }
        ];
    }

    public loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): void {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        void this.vm.search();
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

    public async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

}
