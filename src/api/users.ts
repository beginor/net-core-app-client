import { API_ROOT } from '../config';
import type { IdName } from '../types';
import { createCrud } from './crud';
import { http } from './http';

export interface UserModel {
    id: string;
    userName?: string;
    email?: string;
    emailConfirmed?: boolean;
    phoneNumber?: string;
    phoneNumberConfirmed?: boolean;
    lockoutEnabled?: boolean;
    lockoutEnd?: string;
    accessFailedCount?: number;
    twoFactorEnabled?: boolean;
    createTime?: string;
    lastLogin?: string;
    loginCount?: number;
    surname?: string;
    givenName?: string;
    dateOfBirth?: string;
    gender?: string;
    streetAddress?: string;
    organizeUnit?: IdName;
}

export interface ResetPasswordModel {
    password: string;
    confirmPassword: string;
}

const base = `${API_ROOT}/users`;
const crud = createCrud<UserModel>(base);

export const usersApi = {
    ...crud,
    unlock: (id: string) => http.put(`${base}/${id}/unlock`, null),
    lock: (id: string, lockoutEnd: string) =>
        http.put(`${base}/${id}/lock/${encodeURIComponent(lockoutEnd)}`, null),
    resetPassword: (id: string, model: ResetPasswordModel) =>
        http.put(`${base}/${id}/reset-pass`, model),
    getRoles: (id: string) => http.get<{ name: string }[]>(`${base}/${id}/roles`),
    addRoles: (id: string, roles: string[]) =>
        http.put(`${base}/${id}/roles/${roles.join(',')}`, null),
    removeRoles: (id: string, roles: string[]) =>
        http.delete(`${base}/${id}/roles/${roles.join(',')}`),
};

/** Display name used by the user list and drawers. */
export function userFullName(user: UserModel): string {
    const name = [user.surname, user.givenName].filter(Boolean).join('');
    return name ? `${name}(${user.userName})` : (user.userName ?? '');
}

/** Whether the account is currently locked out. */
export function isLockedOut(user: UserModel): boolean {
    if (!user.lockoutEnabled || !user.lockoutEnd) {
        return false;
    }
    return new Date(user.lockoutEnd) > new Date();
}
