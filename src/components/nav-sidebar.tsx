import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAppStore } from '../stores/app-store';
import type { NavigationNode } from '../types';
import { DynamicIcon } from './dynamic-icon';

type MenuItem = Required<MenuProps>['items'][number];

interface NavSidebarProps {
    collapsed: boolean;
}

function toMenuItems(
    nodes: NavigationNode[],
    level: number,
    pathname: string,
): MenuItem[] {
    return nodes
        .filter(node => !node.isHidden)
        .map((node) => {
            const icon = level === 1 && node.icon
                ? <DynamicIcon icon={node.icon} />
                : undefined;
            if (node.children && node.children.length > 0) {
                return {
                    key: node.id ?? node.url ?? node.title ?? String(level),
                    icon,
                    label: node.title,
                    children: toMenuItems(node.children, level + 1, pathname),
                };
            }
            return {
                key: node.url ?? node.id ?? node.title ?? '',
                icon,
                label: node.title,
            };
        });
}

/** Sidebar menu built from the navigation tree returned by the backend. */
export function NavSidebar({ collapsed }: NavSidebarProps) {
    const root = useAppStore(state => state.menuRoot);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const items = useMemo(
        () => toMenuItems(root.children ?? [], 1, pathname),
        [root, pathname],
    );

    const selectedKey = useMemo(() => {
        const find = (nodes: NavigationNode[]): string | undefined => {
            for (const node of nodes) {
                if (node.url && pathname.startsWith(node.url) && !node.children?.length) {
                    return node.url;
                }
                const child = node.children ? find(node.children) : undefined;
                if (child) {
                    return child;
                }
            }
            return undefined;
        };
        return find(root.children ?? []);
    }, [root, pathname]);

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key.startsWith('/')) {
            void navigate(key);
        }
    };

    return (
        <div className="flex h-full flex-col">
            {root.title && (
                <div className="flex h-18 items-center gap-2 px-4 text-white">
                    <DynamicIcon icon={root.icon} size={20} />
                    {!collapsed && <span className="truncate text-base">{root.title}</span>}
                </div>
            )}
            <Menu
                className="flex-1 overflow-y-auto"
                theme="dark"
                mode="inline"
                inlineCollapsed={collapsed}
                selectedKeys={selectedKey ? [selectedKey] : []}
                defaultOpenKeys={[pathname.split('/')[1] ?? '']}
                items={items}
                onClick={onClick}
            />
        </div>
    );
}
