import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription, interval, lastValueFrom } from 'rxjs';
import { Base64UrlService } from './base64-url.service';
import { API_ROOT } from './inject-tokens';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    public info = new BehaviorSubject<AccountInfo>(
        { id: '', userName: 'anonymous', roles: { }, privileges: { } }
    );

    public fullName = new BehaviorSubject<string>('匿名用户');

    public get token(): string {
        return localStorage.getItem(this.tokenKey) ?? '';
    }

    private get tokenKey(): string {
        return `Bearer:${this.apiRoot}`;
    }

    private interval$: Subscription;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        private base64Url: Base64UrlService
    ) {
        this.interval$ = interval(1000 * 60 * 5).subscribe(
            () => void this.getInfo()
        );
    }

    public async getInfo(): Promise<AccountInfo> {
        try {
            let url = `${this.apiRoot}/account`;
            const tmpToken = sessionStorage.getItem('tmpToken');
            if (tmpToken) {
                url += `?tmpToken=${tmpToken}`;
                sessionStorage.removeItem('tmpToken');
            }
            const info = await lastValueFrom(this.http.get<AccountInfo>(url));
            if (info.token) {
                this.saveToken(info.token);
                delete info.token;
            }
            const currInfo = this.info.getValue();
            if (currInfo.id !== info.id) {
                this.info.next(info);
                const fullname = [];
                if (info.surname) {
                    fullname.push(info.surname);
                }
                if (info.givenName) {
                    fullname.push(info.givenName);
                }
                if (fullname.length === 0) {
                    fullname.push(info.userName);
                }
                this.fullName.next(fullname.join(''));
            }
            return info;
        }
        catch (ex: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(ex);
            localStorage.removeItem(this.tokenKey);
            throw new Error('Can not get account info!');
        }
    }

    public async login(model: LoginModel): Promise<void> {
        const url = this.apiRoot + '/account';
        const loginModel: LoginModel = {
            userName: this.base64Url.encode(model.userName),
            password: this.base64Url.encode(model.password),
            isPersistent: model.isPersistent,
            captcha: model.captcha,
        };
        const token = await lastValueFrom(
            this.http.post(url, loginModel, { responseType: 'text' })
        );
        this.saveToken(token);
    }

    public logout(): void {
        this.removeToken();
        this.info.next({ id: '', roles: {}, privileges: {} });
    }

    public async getUser(): Promise<UserInfo> {
        const userInfo = await lastValueFrom(
            this.http.get<UserInfo>(`${this.apiRoot}/account/user`)
        );
        return userInfo;
    }

    public async updateUser(userInfo: UserInfo): Promise<UserInfo> {
        const updatedUserInfo = await lastValueFrom(
            this.http.put<UserInfo>(`${this.apiRoot}/account/user`, userInfo)
        );
        return updatedUserInfo;
    }

    public async changePassword(model: ChangePasswordModel): Promise<void> {
        const currentPassword = this.base64Url.encode(model.currentPassword);
        const newPassword = this.base64Url.encode(model.newPassword);
        const confirmPassword = this.base64Url.encode(model.confirmPassword);
        await lastValueFrom(
            this.http.put(
                `${this.apiRoot}/account/password`,
                { currentPassword, newPassword, confirmPassword }
            )
        );
    }

    public async searchUserTokens(
        searchModel: UserTokenSearchModel
    ): Promise<UserTokenResultModel> {
        let params = new HttpParams();
        for (const key in searchModel) {
            if (searchModel.hasOwnProperty(key)) {
                const val = searchModel[key] as string;
                params = params.set(key, val);
            }
        }
        const result = await lastValueFrom(
            this.http.get<UserTokenResultModel>(`${this.apiRoot}/account/tokens`, { params })
        );
        return result;
    }

    public async createUserToken(
        model: UserTokenModel
    ): Promise<UserTokenModel> {
        const result = await lastValueFrom(
            this.http.post<UserTokenModel>(`${this.apiRoot}/account/tokens`, model)
        );
        return result;
    }

    public async updateUserToken(
        id: string,
        model: UserTokenModel
    ): Promise<UserTokenModel> {
        const result = await lastValueFrom(
            this.http.put<UserTokenModel>(`${this.apiRoot}/account/tokens/${id}`, model)
        );
        return result;
    }

    public async deleteUserToken(id: string): Promise<void> {
        await lastValueFrom(
            this.http.delete(`${this.apiRoot}/account/tokens/${id}`)
        );
    }

    public async newTokenValue(): Promise<string> {
        return await lastValueFrom(
            this.http.post(
                `${this.apiRoot}/account/new-token-value`,
                null,
                { responseType: 'text' }
            )
        );
    }

    public async getRolesAndPrivileges(): Promise<RoleAndPrivilege> {
        return await lastValueFrom(
            this.http.get<RoleAndPrivilege>(`${this.apiRoot}/account/roles-and-privileges`)
        );
    }

    public addAuthTokenTo(headers: Record<string, string>): void {
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`
        }
    }

    private saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    public currentUser(): AccountInfo {
        return this.info.getValue();
    }

}

export interface AccountInfo {
    id: string;
    userName?: string;
    givenName?: string;
    surname?: string;
    roles: Record<string, boolean>;
    privileges: Record<string, boolean>;
    token?: string;
}

export interface UserInfo {
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
}

export interface LoginModel {
    userName: string;
    password: string;
    isPersistent?: boolean;
    captcha?: string;
}

/** 用户凭证 */
export interface UserTokenModel {
    /** 凭证id */
    id: string;
    /** 凭证名称 */
    name: string;
    /** 凭证值 */
    value: string;
    /** 凭证代表的角色 */
    roles?: string[];
    /** 凭证权限 */
    privileges?: string[];
    /** 允许的 url 地址 */
    urls?: string[];
    /** 过期时间 */
    expiresAt?: string;
    /** 更新时间 */
    updateTime?: string;
}

/** 用户凭证 搜索参数 */
export interface UserTokenSearchModel {
    [key: string]: undefined | number | string;
    /** 跳过的记录数 */
    skip: number;
    /** 取多少条记录 */
    take: number;
    keywords?: string;
}

/** 用户凭证 搜索结果 */
export interface UserTokenResultModel {
    /** 请求跳过的记录数 */
    skip?: number;
    /** 请求多少条记录 */
    take?: number;
    /** 总记录数 */
    total?: number;
    /** 数据列表 */
    data?: UserTokenModel[];
}

/** 角色 */
export interface AppRole {
    /** 角色标识 */
    id: string;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description?: string;
    /** 角色权限 */
    privileges?: string[];
}
/** 系统权限 */
export interface AppPrivilege {
    /** 权限ID */
    id: string;
    /** 权限模块 */
    module?: string;
    /** 权限名称( Identity 的策略名称) */
    name: string;
    /** 权限描述 */
    description?: string;
}

export interface RoleAndPrivilege {
    roles: AppRole[];
    privileges: AppPrivilege[];
}

export interface ChangePasswordModel {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
