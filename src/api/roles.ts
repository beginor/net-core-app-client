import { API_ROOT } from '../config';
import { createCrud } from './crud';
import { http } from './http';

export interface AppRoleModel {
    id: string;
    name: string;
    description?: string;
    isDefault?: boolean;
    isAnonymous?: boolean;
    userCount?: number;
}

const base = `${API_ROOT}/roles`;
const crud = createCrud<AppRoleModel>(base);

export const rolesApi = {
    ...crud,
    getPrivileges: (id: string) => http.get<string[]>(`${base}/${id}/privileges`),
    addPrivilege: (id: string, privilege: string) =>
        http.post(`${base}/${id}/privileges/${privilege}`, null),
    removePrivilege: (id: string, privilege: string) =>
        http.delete(`${base}/${id}/privileges/${privilege}`),
};
