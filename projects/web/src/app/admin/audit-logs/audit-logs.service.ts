import { Injectable, ErrorHandler, LOCALE_ID, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { API_ROOT } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

@Injectable({
    providedIn: 'root'
})
export class AuditLogsService {

    public pageSizeOptions = [20, 40, 60, 80, 100, 200];
    public pageSize = this.pageSizeOptions[0];
    public pageIndex = 1;

    public searchModel: AuditLogSearchModel = {
        skip: this.pageSize * (this.pageIndex - 1),
        take: this.pageSize
    };

    public total = new BehaviorSubject<number>(0);
    public data = new BehaviorSubject<AuditLogModel[]>([]);
    public loading = false;
    public showPagination = false;

    public dateRange: Date[];

    private apiRoot = inject(API_ROOT);
    private locale = inject(LOCALE_ID);
    private http = inject(HttpClient);
    private ui = inject(UiService);
    private errorHandler = inject(ErrorHandler);

    private baseUrl = `${this.apiRoot}/audit-logs`;

    constructor() {
        const now = new Date();
        const startDate = new Date(
            now.getFullYear(), now.getMonth(), now.getDate() - 2
        );
        const today = new Date(
            now.getFullYear(), now.getMonth(), now.getDate()
        );
        this.dateRange = [startDate, today];
    }

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
                const val = this.searchModel[key];
                params = params.set(key, val as string);
            }
        }
        this.loading = true;
        try {
            const result = await lastValueFrom(
                this.http.get<AuditLogResultModel>(this.baseUrl, {
                    params: params
                })
            );
            const total = result.total ?? 0;
            const data = result.data ?? [];
            this.total.next(total);
            this.data.next(data);
            this.showPagination = total > data.length;
            this.loading = false;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.total.next(0);
            this.data.next([]);
            this.ui.showAlert({ type: 'danger', message: '加载审计日志数据出错!'});
        }
        finally {
            this.loading = false;
        }
    }

    public async create(model: AuditLogModel): Promise<AuditLogModel> {
        const result = await lastValueFrom(
            this.http.post<AuditLogModel>(this.baseUrl, model)
        );
        return result;
    }

    public async update(
        id: string,
        model: AuditLogModel
    ): Promise<AuditLogModel> {
        const result = await lastValueFrom(
            this.http.put<AuditLogModel>(`${this.baseUrl}/${id}`, model)
        );
        return result;
    }
}

/** 审计日志模型 */
export interface AuditLogModel {
    /** 审计日志 ID */
    id?: string;
    /** 客户端 IP 地址 */
    ip?: string;
    /** 主机名 */
    hostName?: string;
    /** 请求路径 */
    requestPath?: string;
    /** 请求方法 */
    requestMethod: string;
    /** 用户名 */
    userName?: string;
    /** 开始时间 */
    startAt?: string;
    /** 耗时(毫秒) */
    duration: number;
    /** 响应状态码 */
    responseCode: number;
    /** 控制器名称 */
    controllerName?: string;
    /** 动作名称 */
    actionName?: string;
    /** 描述 */
    description?: string;
}

/** 审计日志搜索参数 */
export interface AuditLogSearchModel {
    [key: string]: undefined | number | string;
    /** 跳过的记录数 */
    skip: number;
    /** 取多少条记录 */
    take: number;
    /** 用户名 */
    userName?: string;
    /** 请求开始日期，精确到日 */
    startDate?: string;
    /** 请求结束日期， 精确到日 */
    endDate?: string;
}

/** 审计日志搜索结果 */
export interface AuditLogResultModel {
    /** 请求跳过的记录数 */
    skip?: number;
    /** 请求多少条记录 */
    take?: number;
    /** 总记录数 */
    total?: number;
    /** 日志列表 */
    data?: AuditLogModel[];
}
