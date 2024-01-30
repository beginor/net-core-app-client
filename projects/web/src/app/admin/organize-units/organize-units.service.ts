import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { API_ROOT } from 'app-shared';

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
    public treeNodes = new BehaviorSubject<NzTreeNodeOptions[]>([]);
    public loading = false;
    public showPagination = false;
    private baseUrl: string;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
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
            const tree = this.mergeToTree(data);
            this.total.next(total);
            this.data.next(tree);
            this.showPagination = total > data.length;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.total.next(0);
            this.data.next([]);
            this.ui.showAlert(
                { type: 'danger', message: '加载组织单元数据出错!' }
            );
        }
        finally {
            this.loading = false;
        }
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
    public async getById(id: string)
        : Promise<AppOrganizeUnitModel | undefined> {
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

    private mergeToTree(units: AppOrganizeUnitModel[]): AppOrganizeUnitModel[] {
        const root = units[0];
        this.findChildren(root, units);
        return [root];
    }

    private findChildren(
        parent: AppOrganizeUnitModel,
        units: AppOrganizeUnitModel[]
    ): void {
        parent.children = units.filter(unit => unit.parentId == parent.id);
        if (parent.children.length > 0) {
            for (const child of parent.children) {
                this.findChildren(child, units);
            }
        }
    }

    /** 当前svc中 data => treeNodes */
    public subscribeDataToTreeNodes(
        disabledOrganizeUnitId?: string
    ): void {
        this.data.subscribe((data) => {
            if (!data || data.length === 0) {
                return;
            }
            const treeNodes = this.convertToNzTreeNodeOptions(
                data, disabledOrganizeUnitId);
            this.treeNodes.next(treeNodes);
        });
    }

    /** 转为 treeSelect 需要的  treeNodes  */
    public convertToNzTreeNodeOptions(
        data: AppOrganizeUnitModel[],
        disabledOrganizeUnitId?: string,
        parentNode?: NzTreeNodeOptions
    )
        : NzTreeNodeOptions[] {
        const treeNodes = data.map((node) => {
            const treeNode: NzTreeNodeOptions = {
                title: node.name,
                key: node.id,
                value: node.id,
                expanded: node.expand,
                disabled: node.id === disabledOrganizeUnitId
                    || parentNode?.disabled,
                parent: parentNode
            };
            if (node.children && node.children.length > 0) {
                treeNode.children =
                    this.convertToNzTreeNodeOptions(
                        node.children,
                        disabledOrganizeUnitId,
                        treeNode
                    );
            }
            else {
                treeNode.isLeaf = true;
            }
            return treeNode;
        });
        return treeNodes;
    }
}

/** 组织单元 */
export interface AppOrganizeUnitModel {
    /** 组织单元ID */
    id: string;
    /** 上级组织单元 ID */
    parentId?: string;
    /** 组织单元名称 */
    name: string;
    /** 组织单元说明 */
    description?: string;
    /** 组织机构排序 */
    sequence: number;
    /** 级别 */
    level?: number;
    /** 是否展开 */
    expand?: boolean;
    /** 下级组织单元 */
    children?: AppOrganizeUnitModel[];
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
