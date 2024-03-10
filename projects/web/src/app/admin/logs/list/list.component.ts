import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays } from 'date-fns';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { AppLogService } from '../logs.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
    selector: 'app-log-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent {

    constructor(
        private drawerService: NzDrawerService,
        public account: AccountService,
        public ui: UiService,
        public vm: AppLogService
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin' },
            { label: '运行日志' }
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

    public async onSelectDate(): Promise<void> {
        this.vm.pageIndex = 1;
        await this.vm.search();
    }

    public onSelectLevel(): void {
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    public disabledDate = (current: Date): boolean =>
        // Can not select days before today and today
        differenceInCalendarDays(current, new Date()) > 0;

}
