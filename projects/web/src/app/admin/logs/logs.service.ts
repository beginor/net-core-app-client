import { Injectable, Inject, ErrorHandler, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { API_ROOT } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

/** 应用程序日志服务 */
@Injectable({
    providedIn: 'root'
})
export class AppLogService {

    public pageSizeOptions = [20, 40, 60, 80, 100, 200];
    public pageSize = this.pageSizeOptions[0];
    public pageIndex = 1;

    public searchModel: AppLogSearchModel = {
        skip: this.pageSize * (this.pageIndex - 1),
        take: this.pageSize,
        level: ''
    };

    public total = new BehaviorSubject<number>(0);
    public data = new BehaviorSubject<AppLogModel[]>([]);
    public loading = false;
    public showPagination = false;

    public dateRange: Date[];

    private baseUrl: string;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        @Inject(LOCALE_ID) private locale: string,
        private ui: UiService,
        private errorHandler: ErrorHandler,
    ) {
        this.baseUrl = `${this.apiRoot}/logs`;
        const now = new Date();
        const startDate = new Date(
            now.getFullYear(), now.getMonth(), now.getDate() - 2
        );
        const today = new Date(
            now.getFullYear(), now.getMonth(), now.getDate()
        );
        this.dateRange = [startDate, today];
    }

    /** 搜索应用程序日志 */
    public async search(): Promise<void> {
        this.searchModel.skip = this.pageSize * (this.pageIndex - 1);
        this.searchModel.take = this.pageSize;
        this.searchModel.startDate = formatDate(
            this.dateRange[0], 'yyyy-MM-dd', this.locale
        );
        this.searchModel.endDate = formatDate(
            this.dateRange[1], 'yyyy-MM-dd', this.locale
        );
        let params = new HttpParams();
        for (const key in this.searchModel) {
            if (this.searchModel.hasOwnProperty(key)) {
                const val = this.searchModel[key] as string;
                params = params.set(key, val);
            }
        }
        this.loading = true;
        try {
            const result = await lastValueFrom(
                this.http.get<AppLogResultModel>(this.baseUrl, { params }) // eslint-disable-line max-len
            );
            const total = result.total ?? 0;
            const data = result.data ?? [];
            this.total.next(total);
            this.data.next(data);
            this.showPagination = total > data.length;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.total.next(0);
            this.data.next([]);
            this.ui.showAlert(
                { type: 'danger', message: '加载运行日志数据出错!'}
            );
        }
        finally {
            this.loading = false;
        }
    }

    /** 获取指定的应用程序日志 */
    public async getById(id: string): Promise<AppLogModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.get<AppLogModel>(`${this.baseUrl}/${id}`) // eslint-disable-line max-len
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取指定的应用程序日志出错！' }
            );
            return;
        }
    }

    public getTextClass(level?: string): string {
        // if (level === 'DEBUG') {
        //     return 'text-muted';
        // }
        if (level === 'INFO') {
            return 'text-info';
        }
        if (level === 'WARN') {
            return 'text-warning';
        }
        if (level === 'ERROR') {
            return 'text-danger';
        }
        if (level === 'FATAL') {
            return 'text-danger';
        }
        return '';
    }

}
/** 应用程序日志 */
export interface AppLogModel {
    /** 日志ID */
    id: string;
    /** 创建时间 */
    createdAt?: string;
    /** 线程ID */
    thread?: string;
    /** 日志级别 */
    level?: string;
    /** 记录者 */
    logger?: string;
    /** 日志消息 */
    message?: string;
    /** 异常信息 */
    exception?: string;
}

/** 应用程序日志 搜索参数 */
export interface AppLogSearchModel {
    [key: string]: undefined | number | string;
    /** 跳过的记录数 */
    skip: number;
    /** 取多少条记录 */
    take: number;
    /** 开始日期，精确到日 */
    startDate?: string;
    /** 结束日期， 精确到日 */
    endDate?: string;
    level?: string;
}

/** 应用程序日志 搜索结果 */
export interface AppLogResultModel {
    /** 请求跳过的记录数 */
    skip?: number;
    /** 请求多少条记录 */
    take?: number;
    /** 总记录数 */
    total?: number;
    /** 数据列表 */
    data?: AppLogModel[];
}
