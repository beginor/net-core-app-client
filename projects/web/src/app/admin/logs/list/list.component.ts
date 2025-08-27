import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays } from 'date-fns';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

import { AppLogService } from '../logs.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
    selector: 'app-log-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    private drawerService = inject(NzDrawerService);
    private ui = inject(UiService);
    protected account = inject(AccountService);
    protected vm = inject(AppLogService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin/dashboard' },
            { label: '运行日志' }
        ]);
    }

    protected loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): void {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        void this.vm.search();
    }

    protected showDetail(id: string, editable: boolean): void {
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

    protected async onSelectDate(): Promise<void> {
        this.vm.pageIndex = 1;
        await this.vm.search();
    }

    protected onSelectLevel(): void {
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    protected disabledDate = (current: Date): boolean =>
        // Can not select days before today and today
        differenceInCalendarDays(current, new Date()) > 0;

}
