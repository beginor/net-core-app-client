import { create } from 'zustand';

import { getAccountInfo, getMenu } from '../api/account';
import { removeToken } from '../api/token';
import type { AccountInfo, Breadcrumb, NavigationNode } from '../types';

const ANONYMOUS: AccountInfo = { id: '', userName: 'anonymous', roles: {}, privileges: {} };

interface AppState {
    account: AccountInfo;
    menuRoot: NavigationNode;
    accountNodes: NavigationNode[];
    siderCollapsed: boolean;
    breadcrumbs: Breadcrumb[];
    /** Load the current account, only replacing it when the user id changes. */
    refreshAccount: () => Promise<AccountInfo>;
    /** Load the navigation tree for the current account. */
    loadMenu: () => Promise<void>;
    logout: () => void;
    toggleSider: () => void;
    setBreadcrumbs: (items: Breadcrumb[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    account: ANONYMOUS,
    menuRoot: { title: '', children: [] },
    accountNodes: [],
    siderCollapsed: true,
    breadcrumbs: [],

    refreshAccount: async () => {
        const account = await getAccountInfo();
        if (get().account.id !== account.id) {
            set({ account });
        }
        return account;
    },

    loadMenu: async () => {
        const menuRoot = await getMenu();
        const accountNode = menuRoot.children?.find(node => node.url === '/account');
        set({ menuRoot, accountNodes: accountNode?.children ?? [] });
        if (menuRoot.title) {
            document.title = menuRoot.title;
        }
    },

    logout: () => {
        removeToken();
        set({ account: { id: '', roles: {}, privileges: {} }, menuRoot: { children: [] } });
    },

    toggleSider: () => set(state => ({ siderCollapsed: !state.siderCollapsed })),

    setBreadcrumbs: (items) => set({ breadcrumbs: items }),
}));

/** Whether the signed in account holds the given privilege. */
export function usePrivilege(name: string): boolean {
    return useAppStore(state => state.account.privileges[name] === true);
}

/** Sidebar nodes of the top level module matching the current path. */
export function selectSidebarNodes(root: NavigationNode, pathname: string): NavigationNode[] {
    for (const node of root.children ?? []) {
        if (node.url && pathname.startsWith(node.url)) {
            return node.children ?? [];
        }
    }
    return [];
}
