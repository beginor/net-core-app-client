import { Injectable, Inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

import { Base64UrlService } from './base64-url.service';
import { API_ROOT } from './inject-tokens';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    public current = signal<AccountInfo>(
        { id: '', userName: 'anonymous', roles: { }, privileges: { } }
    );

    public fullName = computed(() => {
        const account = this.current();
            if (account.id) {
            const fullname = [];
            if (account.surname) {
                fullname.push(account.surname);
            }
            if (account.givenName) {
                fullname.push(account.givenName);
            }
            if (fullname.length === 0) {
                fullname.push(account.userName);
            }
            return fullname.join('');
        }
        else {
            return '匿名用户';
        }
    }, );

    public get token(): string {
        return localStorage.getItem(this.tokenKey) ?? '';
    }
    public set token(value: string) {
        if (value) {
            localStorage.setItem(this.tokenKey, value);
        }
    }

    private get tokenKey(): string {
        return `Bearer:${this.apiRoot}`;
    }

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        private base64Url: Base64UrlService
    ) {
        setInterval(
            () => void this.getAccountInfo(),
            1000 * 60 * 5
        );
    }

    public getAccountInfo(): Observable<AccountInfo> {
        let url = `${this.apiRoot}/account`;
        const tmpToken = sessionStorage.getItem('tmpToken');
        if (tmpToken) {
            url += `?tmpToken=${tmpToken}`;
            sessionStorage.removeItem('tmpToken');
        }
        return this.http.get<AccountInfo>(url).pipe(
            map(account => {
                if (account.token) {
                    this.saveToken(account.token);
                    delete account.token;
                }
                const currAccount = this.current();
                if (currAccount.id !== account.id) {
                    this.current.set(account);
                }
                return account;
            }),
            catchError(err => {
                console.error(err);
                localStorage.removeItem(this.tokenKey);
                throw err;
            })
        );
    }

    public login(model: LoginModel): Observable<string> {
        const url = this.apiRoot + '/account';
        const loginModel: LoginModel = {
            userName: this.base64Url.encode(model.userName),
            password: this.base64Url.encode(model.password),
            isPersistent: model.isPersistent,
            captcha: model.captcha,
        };
        return this.http.post(url, loginModel, { responseType: 'text' }).pipe(
            map(token => {
                this.saveToken(token);
                return token;
            })
        );
    }

    public logout(): void {
        this.removeToken();
        this.current.set({ id: '', roles: {}, privileges: {} });
    }

    public getUser(): Observable<UserInfo> {
        return this.http.get<UserInfo>(`${this.apiRoot}/account/user`);
    }

    public updateUser(userInfo: UserInfo): Observable<UserInfo> {
        return this.http.put<UserInfo>(
            `${this.apiRoot}/account/user`,
            userInfo
        );
    }

    public changePassword(model: ChangePasswordModel): Observable<any> {
        const currentPassword = this.base64Url.encode(model.currentPassword);
        const newPassword = this.base64Url.encode(model.newPassword);
        const confirmPassword = this.base64Url.encode(model.confirmPassword);
        return this.http.put(
            `${this.apiRoot}/account/password`,
            { currentPassword, newPassword, confirmPassword }
        );
    }

    public searchUserTokens(
        searchModel: UserTokenSearchModel
    ): Observable<UserTokenResultModel> {
        let params = new HttpParams();
        for (const key in searchModel) {
            if (searchModel.hasOwnProperty(key)) {
                const val = searchModel[key] as string;
                params = params.set(key, val);
            }
        }
        return this.http.get<UserTokenResultModel>(
            `${this.apiRoot}/account/tokens`,
            { params }
        );
    }

    public createUserToken(
        model: UserTokenModel
    ): Observable<UserTokenModel> {
        return this.http.post<UserTokenModel>(
            `${this.apiRoot}/account/tokens`,
            model
        );
    }

    public updateUserToken(
        id: string,
        model: UserTokenModel
    ): Observable<UserTokenModel> {
        return this.http.put<UserTokenModel>(
            `${this.apiRoot}/account/tokens/${id}`,
            model
        );
    }

    public deleteUserToken(id: string): Observable<any> {
        return this.http.delete(`${this.apiRoot}/account/tokens/${id}`);
    }

    public newTokenValue(): Observable<string> {
        return this.http.post(
            `${this.apiRoot}/account/new-token-value`,
            null,
            { responseType: 'text' }
        )
    }

    public getRolesAndPrivileges(): Observable<RoleAndPrivilege> {
        return this.http.get<RoleAndPrivilege>(
            `${this.apiRoot}/account/roles-and-privileges`
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
