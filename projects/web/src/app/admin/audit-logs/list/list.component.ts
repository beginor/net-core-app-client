import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays } from 'date-fns'

import { SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

import { AuditLogsService } from '../audit-logs.service';

@Component({
    selector: 'app-audits-list',
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

    private ui = inject(UiService);
    protected vm = inject(AuditLogsService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin/dashboard' },
            { label: '审计日志' }
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

    protected getRequestMethodClasses(method: string): string {
        const classes = ['text-center'];
        switch (method.toLowerCase()) {
            case 'get':
                classes.push('text-primary');
                break;
            case 'post':
                classes.push('text-success');
                break;
            case 'put':
                classes.push('text-warning');
                break;
            case 'delete':
                classes.push('text-danger');
        }
        return classes.join(' ');
    }

    protected getDurationClasses(duration: number): string {
        const classes = ['text-end'];
        if (duration < 1000) {
            classes.push('text-success');
        }
        else if (duration < 2000) {
            classes.push('text-warning');
        }
        else {
            classes.push('text-danger');
        }
        return classes.join(' ');
    }

    protected getResponseCodeClasses(code: number): string {
        const classes = ['text-end'];
        if (code < 300) {
            classes.push('text-success');
        }
        else if (code < 500) {
            classes.push('text-warning');
        }
        else {
            classes.push('text-danger');
        }
        return classes.join(' ');
    }

    protected async onSelectDate(): Promise<void> {
        this.vm.pageIndex = 1;
        await this.vm.search();
    }

    protected onUserNameChanged(): void {
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    protected resetUsername(): void {
        this.vm.searchModel.userName = '';
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    protected disabledDate = (current: Date): boolean =>
        // Can not select days before today and today
        differenceInCalendarDays(current, new Date()) > 0;

}
