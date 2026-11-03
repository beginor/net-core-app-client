import { API_ROOT } from '../config';
import { createCrud } from './crud';
import { http } from './http';

export interface AppPrivilegeModel {
    id: string;
    module?: string;
    name: string;
    description?: string;
    isRequired?: boolean;
}

export interface ModulePrivileges {
    module: string;
    privileges: AppPrivilegeModel[];
}

export const privilegesApi = {
    ...createCrud<AppPrivilegeModel>(`${API_ROOT}/privileges`),
    getModules: () => http.get<string[]>(`${API_ROOT}/modules`),
};

/** Group privileges by module, keeping the backend order. */
export function groupByModule(privileges: AppPrivilegeModel[]): ModulePrivileges[] {
    const groups: ModulePrivileges[] = [];
    for (const privilege of privileges) {
        const module = privilege.module ?? '';
        let group = groups.find(item => item.module === module);
        if (!group) {
            group = { module, privileges: [] };
            groups.push(group);
        }
        group.privileges.push(privilege);
    }
    return groups;
}
