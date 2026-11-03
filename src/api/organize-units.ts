import { API_ROOT } from '../config';
import { createCrud } from './crud';

export interface OrganizeUnitModel {
    id: string;
    parentId?: string;
    name: string;
    description?: string;
    sequence: number;
    level?: number;
    expand?: boolean;
    children?: OrganizeUnitModel[];
}

export const organizeUnitsApi = {
    ...createCrud<OrganizeUnitModel>(`${API_ROOT}/organize-units`),
};

/** Merge the flat list returned by the backend into a tree. */
export function toTree(units: OrganizeUnitModel[]): OrganizeUnitModel[] {
    const root = units[0];
    if (!root) {
        return [];
    }
    const attach = (parent: OrganizeUnitModel): void => {
        parent.children = units.filter(unit => unit.parentId === parent.id);
        parent.children.forEach(attach);
    };
    attach(root);
    return [root];
}
