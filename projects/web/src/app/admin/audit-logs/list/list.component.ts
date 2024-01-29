import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays } from 'date-fns'

import { AuditLogsService } from '../audit-logs.service';

@Component({
    selector: 'app-audits-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent {

    constructor(
        public vm: AuditLogsService,
    ) { }

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

    public getRequestMethodClasses(method: string): string {
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

    public getDurationClasses(duration: number): string {
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

    public getResponseCodeClasses(code: number): string {
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

    public async onSelectDate(): Promise<void> {
        this.vm.pageIndex = 1;
        await this.vm.search();
    }

    public onUserNameChanged(): void {
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    public resetUsername(): void {
        this.vm.searchModel.userName = '';
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    public disabledDate = (current: Date): boolean =>
        // Can not select days before today and today
        differenceInCalendarDays(current, new Date()) > 0;

}
