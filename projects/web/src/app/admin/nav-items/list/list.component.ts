import { Component, OnInit } from '@angular/core';

import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { AccountService } from 'app-shared';
import { NavItemsService } from '../nav-items.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
    selector: 'app-nav-item-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    constructor(
        private drawerService: NzDrawerService,
        public account: AccountService,
        public vm: NavItemsService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.vm.search();
    }

    public loadData({
        pageSize = 10,
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
