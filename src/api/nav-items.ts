import { API_ROOT } from '../config';
import { createCrud } from './crud';
import { http } from './http';

export interface NavItemModel {
    id: string;
    parentId?: string;
    title?: string;
    tooltip?: string;
    icon?: string;
    url?: string;
    sequence?: number;
    roles?: string[];
    target?: string;
    frameUrl?: string;
    isHidden?: boolean;
}

export interface MenuOption {
    id?: string;
    title?: string;
    level: number;
}

export const navItemsApi = {
    ...createCrud<NavItemModel>(`${API_ROOT}/nav-items`),
};

/** Flatten the navigation tree into indented select options. */
export function flattenMenu(
    nodes: { id?: string; title?: string; children?: unknown[] }[],
    level: number,
    options: MenuOption[] = [],
): MenuOption[] {
    for (const node of nodes) {
        options.push({ id: node.id, title: `${'-'.repeat(level)} ${node.title ?? ''}`, level });
        const children = node.children as typeof nodes | undefined;
        if (children && children.length > 0) {
            flattenMenu(children, level + 1, options);
        }
    }
    return options;
}

/** Load the account menu and flatten it for the parent node select. */
export async function getMenuOptions(): Promise<MenuOption[]> {
    const root = await http.get<{
        id?: string;
        title?: string;
        children?: { id?: string; title?: string; children?: unknown[] }[];
    }>('/account/menu');
    const options: MenuOption[] = [{ id: root.id, title: root.title, level: 0 }];
    return flattenMenu(root.children ?? [], 1, options);
}
