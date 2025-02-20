import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { Base64UrlService, API_ROOT } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { RolesService, AppRoleModel } from '../roles/roles.service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    public pageSizeOptions = [20, 40, 60, 80, 100, 200];
    public pageSize = this.pageSizeOptions[0];
    public pageIndex = 1;

    public searchModel: UserSearchModel = {
        skip: this.pageSize * (this.pageIndex - 1),
        take: this.pageSize
    };

    public total = new BehaviorSubject<number>(0);
    public data = new BehaviorSubject<UserModel[]>([]);
    public loading = false;
    public showPagination = false;
    public sortMethods = [
        { value: 'CreateTime:DESC', text: '最近创建' },
        { value: 'CreateTime:ASC', text: '最早创建' },
        { value: 'LastLogin:DESC', text: '最近登录' },
        { value: 'LoginCount:DESC', text: '登录次数' },
        { value: 'UserName:ASC', text: '用户名' }
    ];
    public roles = new BehaviorSubject<AppRoleModel[]>([]);

    private baseUrl: string;
    private rolesSvc: RolesService;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        private ui: UiService,
        private errorHandler: ErrorHandler,
        private base64Url: Base64UrlService
    ) {
        this.baseUrl = this.apiRoot + '/users';
        this.searchModel.sortBy = this.sortMethods[0].value;
        this.rolesSvc = new RolesService(http, apiRoot, ui, errorHandler);
        this.rolesSvc.data.subscribe(data => {
            this.roles.next(data);
        });
    }

    public async search(): Promise<void> {
        this.searchModel.skip = this.pageSize * (this.pageIndex - 1);
        this.searchModel.take = this.pageSize;

        let params = new HttpParams();
        for (const key in this.searchModel) {
            if (this.searchModel.hasOwnProperty(key)) {
                const val = this.searchModel[key];
                if (val) {
                    params = params.set(key, val as string);
                }
            }
        }
        this.loading = true;
        try {
            const result = await lastValueFrom(
                this.http.get<UserSearchResult>(this.baseUrl, { params })
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
                { type: 'danger', message: '加载用户数据出错!' }
            );
        }
        finally {
            this.loading = false;
        }
    }

    /** 创建用户 */
    public async create(
        model: UserModel
    ): Promise<UserModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.post<UserModel>(this.baseUrl, model)
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '创建用户出错！' }
            );
            return;
        }
    }

    /** 获取指定的用户 */
    public async getById(id: string): Promise<UserModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.get<UserModel>(`${this.baseUrl}/${id}`)
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取指定的用户出错！' }
            );
            return;
        }
    }

    /** 删除用户 */
    public async delete(id: string): Promise<boolean> {
        const confirm = await this.ui.showConfirm('确认删除么？');
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
            this.ui.showAlert(
                { type: 'danger', message: '删除用户出错！' }
            );
            return false;
        }
    }

    /** 更新用户 */
    public async update(
        id: string,
        model: UserModel
    ): Promise<UserModel | undefined> {
        try {
            const result = await lastValueFrom(
                this.http.put<UserModel>(`${this.baseUrl}/${id}`, model)
            );
            return result;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '更新用户出错！' }
            );
            return;
        }
    }

    public async unlockUser(id: string): Promise<boolean> {
        const confirmed = await this.ui.showConfirm('确认解锁该用户么？');
        if (!confirmed) {
            return false;
        }
        try {
            const url = `${this.baseUrl}/${id}/unlock`;
            await lastValueFrom(this.http.put<null>(url, null));
            await this.search();
            return true;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '解锁用户失败！' }
            );
            return false;
        }
    }

    public async lockUser(id: string, lockoutEnd: string): Promise<boolean> {
        try {
            const url = `${this.baseUrl}/${id}/lock/${lockoutEnd}`;
            await lastValueFrom(this.http.put<null>(url, null));
            await this.search();
            return true;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '锁定用户失败！' }
            );
            return false;
        }
    }

    public async resetPass(
        id: string,
        model: ResetPasswordModel
    ): Promise<boolean> {
        const confirmed = await this.ui.showConfirm('确认重置该用户的密码么？');
        if (!confirmed) {
            return false;
        }
        try {
            const encryptModel: ResetPasswordModel = {
                password: this.base64Url.encode(model.password),
                confirmPassword: this.base64Url.encode(model.confirmPassword)
            };
            const url = `${this.baseUrl}/${id}/reset-pass`;
            await lastValueFrom(this.http.put(url, encryptModel));
            return true;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '重置用户密码失败！' }
            );
            return false;
        }
    }

    /** 获取全部角色 */
    public async getRoles(): Promise<void> {
        try {
            this.rolesSvc.searchModel.organizeUnitId = this.searchModel.organizeUnitId; // eslint-disable-line @stylistic/max-len
            this.rolesSvc.searchModel.skip = 0;
            this.rolesSvc.searchModel.take = 999;
            await this.rolesSvc.search();
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取全部角色失败！' }
            );
        }
    }

    /* 获取用户角色 */
    public async getUserRoles(userId: string): Promise<string[]> {
        try {
            const url = `${this.baseUrl}/${userId}/roles`;
            const roles = await lastValueFrom(
                this.http.get<AppRoleModel[]>(url)
            );
            return roles.map(r => r.name);
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取用户角色失败！' }
            );
            return [];
        }
    }

    public async saveUserRoles(
        userId: string,
        toAdd: string[],
        toDelete: string[]
    ): Promise<void> {
        try {
            if (toAdd.length > 0) {
                const rolesToAdd = toAdd.join(',');
                const url = `${this.baseUrl}/${userId}/roles/${rolesToAdd}`;
                await lastValueFrom(this.http.put(url, null));
            }
            if (toDelete.length > 0) {
                const rolesToDelete = toDelete.join(',');
                const url = `${this.baseUrl}/${userId}/roles/${rolesToDelete}`;
                await lastValueFrom(this.http.delete(url));
            }
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '保存用户角色失败！' }
            );
        }
    }

}

/**
 * 应用程序用户模型
 */
export interface UserModel {
    /** 用户ID */
    id: string;
    /** 用户名 */
    userName?: string;
    /** 电子邮箱地址 */
    email?: string;
    /** 电子邮箱地址是否已确认 */
    emailConfirmed?: boolean;
    /** 电话号码 */
    phoneNumber?: string;
    /** 电话号码是否已经确认 */
    phoneNumberConfirmed?: boolean;
    /** 是否允许（自动）锁定 */
    lockoutEnabled?: boolean;
    /** 锁定结束时间 */
    lockoutEnd?: string;
    /** 登录失败次数 */
    accessFailedCount?: number;
    /** 是否启用两部认证 */
    twoFactorEnabled?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 最近登录时间 */
    lastLogin?: string;
    /** 登录次数 */
    loginCount?: number;
    /** 姓氏 */
    surname?: string;
    /** 名称 */
    givenName?: string;
    /** 出生日期 */
    dateOfBirth?: string;
    /** 性别 */
    gender?: string;
    /** 家庭地址 */
    streetAddress?: string;
    /** 工作单元 */
    organizeUnit?: StringIdNameModel;
}

export interface StringIdNameModel {
    id: string;
    name: string;
}

/** 用户搜索参数 */
export interface UserSearchModel {
    [key: string]: undefined | number | string;
    /** 跳过的记录数 */
    skip: number;
    /** 取多少条记录 */
    take: number;
    /** 用户名 */
    userName?: string;
    /** 过滤条件 */
    filter?: string;
    /** 排序 */
    sortBy?: string;
    /** 角色名称 */
    roleName?: string;
    /** 组织机构ID */
    organizeUnitId?: string;
}

/** 用户搜索结果 */
export interface UserSearchResult {
    /** 用户列表 */
    data?: UserModel[];
    /** 总记录数 */
    total?: number;
    /** 请求跳过的记录数 */
    skip?: number;
    /** 请求取多少条记录 */
    take?: number;
}

export interface ResetPasswordModel {
    /** 密码 */
    password: string;
    /** 确认密码 */
    confirmPassword: string;
}
