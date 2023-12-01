import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { UiService } from 'projects/web/src/app/common';

/** 组织单元服务 */
@Injectable({
    providedIn: 'root'
})
export class OrganizeUnitService {

    public searchModel: AppOrganizeUnitSearchModel = {
        skip: 0,
        take: 10
    };
    public total = new BehaviorSubject<number>(0);
    public data = new BehaviorSubject<AppOrganizeUnitModel[]>([]);
    public loading = false;
    public showPagination = false;
    private baseUrl: string;

    constructor(
        private http: HttpClient,
        @Inject('apiRoot') private apiRoot: string,
        private ui: UiService,
        private errorHandler: ErrorHandler
    ) {
        this.baseUrl = `${apiRoot}/organize-units`;
    }

    /** 搜索组织单元 */
    public async search(): Promise<void> {
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
                this.http.get<AppOrganizeUnitResultModel>(this.baseUrl, { params }) // eslint-disable-line max-len
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
                { type: 'danger', message: '加载组织单元数据出错!'}
            );
        }
        finally {
            this.loading = false;
        }
    }

    /** 更改页码分页查询 */
    public async onPageChange(p: number): Promise<void> {
        this.searchModel.skip = (p - 1) * this.searchModel.take;
        await this.search();
    }

    /** 更改分页大小 */
    public async onPageSizeChange(): Promise<void> {
        this.searchModel.skip = 0;
        await this.search();
    }

    /** 创建组织单元 */
    public async create(
        model: AppOrganizeUnitModel
    ): Promise<AppOrganizeUnitModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.post<AppOrganizeUnitModel>(this.baseUrl, model) // eslint-disable-line max-len
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '创建组织单元出错！' }
            );
            return;
        }
    }

    /** 获取指定的组织单元 */
    public async getById(id: string): Promise<AppOrganizeUnitModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.get<AppOrganizeUnitModel>(`${this.baseUrl}/${id}`) // eslint-disable-line max-len
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取指定的组织单元出错！' }
            );
            return;
        }
    }

    /** 删除组织单元 */
    public async delete(id: string): Promise<boolean> {
        const confirm = await this.ui.showConfirm('确认删除么？');
        if (!confirm) {
            return false;
        }
        try {
            await lastValueFrom(
                this.http.delete(`${this.baseUrl}/${id}`) // eslint-disable-line max-len
            );
            return true;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '删除组织单元出错！' }
            );
            return false;
        }
    }

    /** 更新组织单元 */
    public async update(
        id: string,
        model: AppOrganizeUnitModel
    ): Promise<AppOrganizeUnitModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.put<AppOrganizeUnitModel>(`${this.baseUrl}/${id}`, model) // eslint-disable-line max-len
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '更新组织单元出错！' }
            );
            return;
        }
    }

}

/** 组织单元 */
export interface AppOrganizeUnitModel {
    /** 组织单元ID */
    id: string;
    /** 上级组织单元 ID */
    parentId?: string;
    /** 组织单元编码 */
    code: string;
    /** 组织单元名称 */
    name: string;
    /** 组织单元说明 */
    description?: string;
    /** 组织机构排序 */
    sequence: number;
}

/** 组织单元 搜索参数 */
export interface AppOrganizeUnitSearchModel {
    [key: string]: undefined | number | string;
    /** 跳过的记录数 */
    skip: number;
    /** 取多少条记录 */
    take: number;
}

/** 组织单元 搜索结果 */
export interface AppOrganizeUnitResultModel {
    /** 请求跳过的记录数 */
    skip?: number;
    /** 请求多少条记录 */
    take?: number;
    /** 总记录数 */
    total?: number;
    /** 数据列表 */
    data?: AppOrganizeUnitModel[];
}
