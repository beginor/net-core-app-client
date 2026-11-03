import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useNavigate } from 'react-router';

import { useAppStore } from '../stores/app-store';
import { DynamicIcon } from './dynamic-icon';

/** Header with the sider trigger, breadcrumbs and the account menu. */
export function AppHeader() {
    const account = useAppStore(state => state.account);
    const accountNodes = useAppStore(state => state.accountNodes);
    const breadcrumbs = useAppStore(state => state.breadcrumbs);
    const collapsed = useAppStore(state => state.siderCollapsed);
    const toggleSider = useAppStore(state => state.toggleSider);
    const logout = useAppStore(state => state.logout);
    const navigate = useNavigate();

    const fullName = (): string => {
        if (!account.id) {
            return '匿名用户';
        }
        const name = [account.surname, account.givenName].filter(Boolean).join('');
        return name || account.userName || '';
    };

    const items: MenuProps['items'] = [
        ...accountNodes.map(node => ({
            key: node.url ?? node.id ?? '',
            icon: <DynamicIcon icon={node.icon} />,
            label: node.title,
        })),
        ...(accountNodes.length > 0 ? [{ type: 'divider' as const }] : []),
        { key: 'logout', icon: <LogoutOutlined />, label: '注销' },
    ];

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            logout();
            void navigate('/login');
        }
        else if (key.startsWith('/')) {
            void navigate(key);
        }
    };

    return (
        <div className="flex h-full items-center">
            <div
                className="cursor-pointer px-6 transition-colors hover:text-blue-500"
                onClick={toggleSider}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <div className="grow">
                <Breadcrumb
                    items={breadcrumbs.map(item => ({
                        title: item.url ? <Link to={item.url}>{item.label}</Link> : item.label,
                    }))}
                />
            </div>
            {account.id ? (
                <Dropdown menu={{ items, onClick }} placement="bottomRight" trigger={['click']}>
                    <Button type="text">
                        <UserOutlined /> {fullName()}
                    </Button>
                </Dropdown>
            ) : (
                <Link to="/login">登录</Link>
            )}
        </div>
    );
}
