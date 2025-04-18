import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { API_ROOT } from 'app-shared';

import { UiService, NavigationNode } from 'projects/web/src/app/common';
import { RolesService, AppRoleModel } from '../roles/roles.service';

/** 导航节点（菜单）服务 */
@Injectable({
    providedIn: 'root'
})
export class NavItemsService {

    public pageSizeOptions = [20, 40, 60, 80, 100, 200];
    public pageSize = this.pageSizeOptions[0];
    public pageIndex = 1;

    public searchModel: AppNavItemSearchModel = {
        skip: this.pageSize * (this.pageIndex - 1),
        take: this.pageSize
    };

    public total = new BehaviorSubject<number>(0);
    public data = new BehaviorSubject<NavItemModel[]>([]);
    public loading = false;
    public showPagination = false;
    public roles: AppRoleModel[] = [];

    private baseUrl: string;
    private rolesSvc: RolesService;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        private uiService: UiService,
        private errorHandler: ErrorHandler
    ) {
        this.baseUrl = `${apiRoot}/nav-items`;
        this.rolesSvc = new RolesService(
            http, apiRoot, uiService, errorHandler
        );
        this.rolesSvc.data.subscribe(data => {
            this.roles = data;
        });
    }

    /** 搜索导航节点（菜单） */
    public async search(): Promise<void> {
        this.searchModel.skip = this.pageSize * (this.pageIndex - 1);
        this.searchModel.take = this.pageSize;
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
                this.http.get<AppNavItemResultModel>(
                    this.baseUrl, { params: params }
                )
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
            this.uiService.showAlert(
                { type: 'danger', message: '加载导航节点（菜单）数据出错!'}
            );
        }
        finally {
            this.loading = false;
        }
    }

    /** 创建导航节点（菜单） */
    public async create(
        model: NavItemModel
    ): Promise<NavItemModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.post<NavItemModel>(this.baseUrl, model)
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.uiService.showAlert(
                { type: 'danger', message: '创建导航节点（菜单）出错！' }
            );
            return;
        }
    }

    /** 获取指定的导航节点（菜单） */
    public async getById(id: string): Promise<NavItemModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.get<NavItemModel>(`${this.baseUrl}/${id}`)
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.uiService.showAlert(
                { type: 'danger', message: '获取指定的导航节点（菜单）出错！' }
            );
            return;
        }
    }

    /** 删除导航节点（菜单） */
    public async delete(id: string): Promise<boolean> {
        const confirm = await this.uiService.showConfirm('确认删除么？');
        if (!confirm) {
            return false;
        }
        try {
            await lastValueFrom(
                this.http.delete(`${this.baseUrl}/${id}`)
            );
            return true;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.uiService.showAlert(
                { type: 'danger', message: '删除导航节点（菜单）出错！' }
            );
            return false;
        }
    }

    /** 更新导航节点（菜单） */
    public async update(
        id: string,
        model: NavItemModel
    ): Promise<NavItemModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.put<NavItemModel>(`${this.baseUrl}/${id}`, model)
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.uiService.showAlert(
                { type: 'danger', message: '更新导航节点（菜单）出错！' }
            );
            return;
        }
    }

    public async getAllRoles(): Promise<void> {
        try {
            this.rolesSvc.searchModel.skip = 0;
            this.rolesSvc.searchModel.take = 999;
            await this.rolesSvc.search();
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.uiService.showAlert({ type: 'danger', message: '获取全部角色出错！' });
        }
    }

    public async getMenuOptions(): Promise<MenuOption[]> {
        const options: MenuOption[] = [];
        try {
            const menuUrl = `${this.apiRoot}/account/menu`;
            const rootNode = await lastValueFrom(
                this.http.get<NavigationNode>(menuUrl)
            );
            const option = { level: 0, id: rootNode.id, title: rootNode.title };
            options.push(option);
            this.pushChildrenRecursively(
                options,
                option.level + 1,
                rootNode.children ?? []
            );
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.uiService.showAlert({ type: 'danger', message: '获取全部菜单出错！' });
        }
        return options;
    }

    private pushChildrenRecursively(
        options: MenuOption[],
        level: number,
        nodes: NavigationNode[]
    ): void {
        for (const node of nodes) {
            const prefix = [];
            for (let i = 0; i < level; i++) {
                prefix.push('-');
            }
            prefix.push(' ');
            prefix.push(node.title);
            options.push(
                { level: level, id: node.id, title: prefix.join('') }
            );
            if (!!node.children && node.children.length > 0) {
                this.pushChildrenRecursively(options, level + 1, node.children);
            }
        }
    }

}

/** 导航节点（菜单） */
export interface NavItemModel {
    /** 节点ID */
    id: string;
    /** parent_id, int8 */
    parentId?: string;
    /** 标题 */
    title?: string;
    /** 提示文字 */
    tooltip?: string;
    /** 图标 */
    icon?: string;
    /** 导航地址 */
    url?: string;
    /** 顺序 */
    sequence?: number;
    /** 角色 */
    roles?: string[];
    /** 导航目标 */
    target?: string;
    /** 内嵌窗口地址 */
    frameUrl?: string;
    /** 是否隐藏 */
    isHidden?: boolean;
}

/** 导航节点（菜单） 搜索参数 */
export interface AppNavItemSearchModel {
    [key: string]: undefined | number | string;
    /** 跳过的记录数 */
    skip: number;
    /** 取多少条记录 */
    take: number;
}

/** 导航节点（菜单） 搜索结果 */
export interface AppNavItemResultModel {
    /** 请求跳过的记录数 */
    skip?: number;
    /** 请求多少条记录 */
    take?: number;
    /** 总记录数 */
    total?: number;
    /** 数据列表 */
    data?: NavItemModel[];
}

export interface MenuOption {
    id?: string;
    title?: string;
    level?: number;
}
