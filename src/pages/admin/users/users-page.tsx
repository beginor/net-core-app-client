import { InfoCircleOutlined, MoreOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Input, Select, Space, Table, Tag, Tooltip, Tree } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { rolesApi } from '../../../api/roles';
import type { AppRoleModel } from '../../../api/roles';
import { isLockedOut, userFullName, usersApi } from '../../../api/users';
import type { UserModel } from '../../../api/users';
import { useBreadcrumbs } from '../../../hooks/use-breadcrumbs';
import { useDataList } from '../../../hooks/use-data-list';
import type { SearchModel } from '../../../api/crud';
import { useOrganizeUnits } from '../../../hooks/use-organize-units';
import { useAppStore } from '../../../stores/app-store';
import { formatDateTime } from '../../../utils/date';
import { confirmDialog, showMessage } from '../../../utils/feedback';
import { UserDetailDrawer } from './user-detail-drawer';
import { UserLockDrawer } from './user-lock-drawer';
import { UserPasswordDrawer } from './user-password-drawer';
import { UserRolesDrawer } from './user-roles-drawer';

const SORT_METHODS = [
    { value: 'CreatedAt:DESC', label: '最近创建' },
    { value: 'CreatedAt:ASC', label: '最早创建' },
    { value: 'LastLogin:DESC', label: '最近登录' },
    { value: 'LoginCount:DESC', label: '登录次数' },
    { value: 'UserName:ASC', label: '用户名' },
];

type DrawerKind = 'detail' | 'lock' | 'password' | 'roles';

interface DrawerState {
    kind: DrawerKind;
    id: string;
    editable: boolean;
    fullname: string;
}

/** User management: organize unit tree on the left, user table on the right. */
export function UsersPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '管理', url: '/admin/dashboard' }, { label: '用户管理' }]);
    const [params] = useSearchParams();
    const roleName = params.get('roleName') ?? '';

    const [roles, setRoles] = useState<AppRoleModel[]>([]);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);

    const account = useAppStore(state => state.account);
    const { treeData, reload: reloadUnits } = useOrganizeUnits();

    const list = useDataList<UserModel, SearchModel>({
        fetch: search => usersApi.search(search),
        initialSearch: {
            userName: '',
            roleName,
            sortBy: SORT_METHODS[0].value,
            organizeUnitId: '',
        },
        errorText: '加载用户数据出错！',
    });

    // Load the role list once for the filter select.
    useEffect(() => {
        void rolesApi.search({ skip: 0, take: 999 })
            .then(result => setRoles(result.data ?? []))
            .catch((ex: unknown) => console.error(ex));
    }, []);

    const privileges = account.privileges;
    const canViewGears = [
        'app_users.update',
        'app_users.delete',
        'app_users.reset_pass',
        'app_users.lock',
        'app_users.unlock',
        'app_users.read_user_roles',
    ].some(name => privileges[name]);

    const open = (kind: DrawerKind, user: UserModel): void => {
        setDrawer({ kind, id: user.id, editable: true, fullname: userFullName(user) });
    };

    const remove = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认删除么？'))) {
            return;
        }
        try {
            await usersApi.remove(id);
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '删除用户出错！');
        }
    };

    const unlock = async (id: string): Promise<void> => {
        if (!(await confirmDialog('确认解锁该用户么？'))) {
            return;
        }
        try {
            await usersApi.unlock(id);
            await list.reload();
        }
        catch (ex) {
            console.error(ex);
            showMessage('error', '解锁用户失败！');
        }
    };

    /** Menu items allowed by the current privileges. */
    const userMenuItems = (record: UserModel): MenuProps['items'] => {
        const items: MenuProps['items'] = [];
        if (privileges['app_users.update']) {
            items.push({ key: 'detail', label: '编辑' });
        }
        if (isLockedOut(record)) {
            if (privileges['app_users.unlock']) {
                items.push({ key: 'unlock', label: '解锁' });
            }
        }
        else if (privileges['app_users.lock']) {
            items.push({ key: 'lock', label: '锁定' });
        }
        if (privileges['app_users.reset_pass']) {
            items.push({ key: 'password', label: '重置密码' });
        }
        if (privileges['app_users.read_user_roles']) {
            items.push({ key: 'roles', label: '角色' });
        }
        if (privileges['app_users.delete']) {
            items.push({ key: 'delete', label: '删除', danger: true });
        }
        return items;
    };

    const columns: TableProps<UserModel>['columns'] = [
        {
            title: '#',
            width: 50,
            align: 'right',
            render: (_v, _r, index) => (list.pageIndex - 1) * list.pageSize + index + 1,
        },
        { title: '组织单元', dataIndex: ['organizeUnit', 'name'], align: 'center' },
        {
            title: '用户名',
            dataIndex: 'userName',
            render: (_v, record) => (
                <span>
                    {userFullName(record)}
                    {isLockedOut(record) && (
                        <Tooltip title="该用户已经被锁定！">
                            <Tag color="red" className="ms-1">已锁定</Tag>
                        </Tooltip>
                    )}
                </span>
            ),
        },
        { title: '电话', dataIndex: 'phoneNumber', align: 'center' },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            render: value => formatDateTime(value as string),
        },
        {
            title: '最近登录',
            dataIndex: 'lastLogin',
            align: 'center',
            render: value => formatDateTime(value as string),
        },
        { title: '登录次数', dataIndex: 'loginCount', align: 'right' },
        {
            title: '操作',
            align: 'center',
            width: 90,
            render: (_v, record) => (
                <Space.Compact size="small">
                    {account.privileges['app_users.read_by_id'] && (
                        <Tooltip title="详情">
                            <Button icon={<InfoCircleOutlined />} onClick={() => open('detail', record)} />
                        </Tooltip>
                    )}
                    {canViewGears && (
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items: userMenuItems(record),
                                onClick: ({ key }) => {
                                    if (key === 'delete') {
                                        void remove(record.id);
                                    }
                                    else if (key === 'unlock') {
                                        void unlock(record.id);
                                    }
                                    else {
                                        open(key as DrawerKind, record);
                                    }
                                },
                            }}
                        >
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
                    )}
                </Space.Compact>
            ),
        },
    ];

    return (
        <div className="flex gap-3">
            <Card
                className="w-1/6 shrink-0"
                size="small"
                title="组织单元"
                extra={<Button type="text" size="small" icon={<SyncOutlined />} onClick={() => void reloadUnits()} />}
                styles={{ body: { padding: 4 } }}
            >
                <Tree
                    className="organize-unit-tree"
                    treeData={treeData}
                    defaultExpandAll
                    onSelect={keys => void list.research({ organizeUnitId: String(keys[0] ?? '') })}
                />
            </Card>
            <Card
                className="ant-card-data-list grow"
                title="用户"
                extra={
                    <Space wrap>
                        <Input.Search
                            allowClear
                            placeholder="按用户名搜索"
                            value={list.search.userName}
                            onChange={e => list.setSearch({ userName: e.target.value })}
                            onSearch={() => void list.research()}
                        />
                        <Select
                            style={{ width: 160 }}
                            value={list.search.roleName}
                            onChange={value => void list.research({ roleName: value })}
                            options={[
                                { value: '', label: '全部用户' },
                                ...roles.map(item => ({
                                    value: item.name,
                                    label: item.description ?? `${item.name}(${item.userCount ?? 0})`,
                                })),
                            ]}
                        />
                        <Select
                            style={{ width: 130 }}
                            value={list.search.sortBy}
                            onChange={value => void list.research({ sortBy: value })}
                            options={SORT_METHODS}
                        />
                        <Space.Compact>
                            {account.privileges['app_users.create'] && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setDrawer({ kind: 'detail', id: '0', editable: true, fullname: '' })}
                                >
                                    新建用户
                                </Button>
                            )}
                            <Button icon={<SyncOutlined />} onClick={() => void list.reload()}>
                                刷新
                            </Button>
                        </Space.Compact>
                    </Space>
                }
            >
                <Table<UserModel>
                    size="small"
                    rowKey="id"
                    columns={columns}
                    dataSource={list.data}
                    loading={list.loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: list.pageIndex,
                        pageSize: list.pageSize,
                        total: list.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (count, range) =>
                            `当前显示 ${count} 条记录中的第 ${range[0]} 至 ${range[1]} 条`,
                        onChange: (page, size) => void list.load(page, size),
                    }}
                />
            </Card>
            <UserDrawers state={drawer} onClose={result => {
                setDrawer(null);
                if (result === 'ok') {
                    void list.reload();
                }
            }} />
        </div>
    );
}

interface UserDrawersProps {
    state: DrawerState | null;
    onClose: (result: '' | 'ok') => void;
}

/** Render the drawer matching the current state. */
function UserDrawers({ state, onClose }: UserDrawersProps) {
    if (!state) {
        return null;
    }
    switch (state.kind) {
        case 'lock':
            return <UserLockDrawer id={state.id} fullname={state.fullname} onClose={onClose} />;
        case 'password':
            return <UserPasswordDrawer id={state.id} fullname={state.fullname} onClose={onClose} />;
        case 'roles':
            return <UserRolesDrawer id={state.id} fullname={state.fullname} onClose={onClose} />;
        default:
            return <UserDetailDrawer id={state.id} editable={state.editable} onClose={onClose} />;
    }
}

export default UsersPage;
