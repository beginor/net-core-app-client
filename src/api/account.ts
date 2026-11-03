import { API_ROOT } from '../config';
import type { AccountInfo, NavigationNode, PaginatedResult } from '../types';
import { encodeBase64Url } from '../utils/base64-url';
import { http } from './http';
import { saveToken } from './token';

export interface LoginModel {
    userName: string;
    password: string;
    isPersistent?: boolean;
    captcha: string;
}

export interface UserInfo {
    id: string;
    userName?: string;
    email?: string;
    phoneNumber?: string;
    surname?: string;
    givenName?: string;
    dateOfBirth?: string;
    gender?: string;
    streetAddress?: string;
    createTime?: string;
    lastLogin?: string;
    loginCount?: number;
}

export interface ChangePasswordModel {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserTokenModel {
    id?: string;
    name?: string;
    value?: string;
    roles?: string[];
    privileges?: string[];
    urls?: string[];
    expiresAt?: string;
    updatedAt?: string;
}

export interface UserTokenSearchModel {
    skip: number;
    take: number;
    keywords?: string;
}

export interface AppRole {
    name: string;
    description?: string;
}

export interface AppPrivilege {
    id: string;
    name: string;
    module?: string;
    description?: string;
}

export interface RoleAndPrivilege {
    roles: AppRole[];
    privileges: AppPrivilege[];
}

const TMP_TOKEN_KEY = 'tmpToken';

/** Read the one-time token from sessionStorage, removing it after use. */
function takeTmpToken(): string | null {
    const value = sessionStorage.getItem(TMP_TOKEN_KEY);
    if (value) {
        sessionStorage.removeItem(TMP_TOKEN_KEY);
    }
    return value;
}

/** Fetch the current account, persisting a token if the response carries one. */
export async function getAccountInfo(): Promise<AccountInfo> {
    const tmpToken = takeTmpToken();
    const account = await http.get<AccountInfo>('/account', {
        params: tmpToken ? { tmpToken } : undefined,
    });
    if (account.token) {
        saveToken(account.token);
        delete account.token;
    }
    return account;
}

/** Sign in and persist the returned bearer token. */
export async function login(model: LoginModel): Promise<string> {
    const body = {
        userName: encodeBase64Url(model.userName),
        password: encodeBase64Url(model.password),
        isPersistent: model.isPersistent,
        captcha: model.captcha,
    };
    const token = await http.post<string>('/account', body, { responseType: 'text' });
    saveToken(token);
    return token;
}

/** Captcha image url, the timestamp prevents browser caching. */
export function captchaUrl(): string {
    return `${API_ROOT}/captcha?t=${Date.now()}`;
}

export function getMenu(): Promise<NavigationNode> {
    return http.get<NavigationNode>('/account/menu');
}

export function getUser(): Promise<UserInfo> {
    return http.get<UserInfo>('/account/user');
}

export function updateUser(model: UserInfo): Promise<UserInfo> {
    return http.put<UserInfo>('/account/user', model);
}

export function changePassword(model: ChangePasswordModel): Promise<void> {
    return http.put('/account/password', {
        oldPassword: encodeBase64Url(model.oldPassword),
        newPassword: encodeBase64Url(model.newPassword),
        confirmPassword: encodeBase64Url(model.confirmPassword),
    });
}

export function searchUserTokens(
    model: UserTokenSearchModel,
): Promise<PaginatedResult<UserTokenModel>> {
    return http.get<PaginatedResult<UserTokenModel>>('/account/tokens', {
        params: { ...model },
    });
}

export function createUserToken(model: UserTokenModel): Promise<UserTokenModel> {
    return http.post<UserTokenModel>('/account/tokens', model);
}

export function updateUserToken(id: string, model: UserTokenModel): Promise<UserTokenModel> {
    return http.put<UserTokenModel>(`/account/tokens/${id}`, model);
}

export function deleteUserToken(id: string): Promise<void> {
    return http.delete(`/account/tokens/${id}`);
}

export function newTokenValue(): Promise<string> {
    return http.post<string>('/account/new-token-value', null, { responseType: 'text' });
}

export function getRolesAndPrivileges(): Promise<RoleAndPrivilege> {
    return http.get<RoleAndPrivilege>('/account/roles-and-privileges');
}
